import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const ALLOWED_CATEGORIES = [
  'blanket',
  'laundry_basket',
  'hangers',
  'fan',
  'heater',
  'shoes',
  'cleaning_supplies',
  'clothing',
  'other',
] as const;

type Category = typeof ALLOWED_CATEGORIES[number];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, mimeType } = req.body || {};

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY environment variable is not configured in Vercel settings.',
      });
    }

    const base64Data = image.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const cleanMimeType = mimeType || 'image/jpeg';

    const systemInstruction = `You are MoveGood's computer vision assistant.
Analyze the user's photo of items being left behind or packed during college move-out (dorm room, apartment, or closet cleanout).
Identify all reusable or donatable items visible in the image.
Count the rough quantity.
Assess visible condition (good, worn, unclear).
Categorize each item strictly into one of:
- 'blanket': bedding, comforters, fleece throws, duvets, blankets
- 'laundry_basket': hampers, plastic laundry baskets, mesh hampers
- 'hangers': coat hangers (plastic, wooden, wire)
- 'fan': desk fans, box fans, standing fans
- 'heater': space heaters, ceramic heaters, portable radiators
- 'shoes': sneakers, boots, athletic running shoes
- 'cleaning_supplies': disinfectant spray, detergents, cleaners, sponges
- 'clothing': coats, shirts, jackets, sweaters
- 'other': unlisted items, storage bins, desk lamps

Be honest and conservative. If an appliance (heater, fan, electronic) or footwear is detected, specify a concise follow-up condition check question for the student (e.g. "Does the heater work, with no frayed wires or damage?").`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: cleanMimeType,
              data: base64Data,
            },
          },
          {
            text: 'Identify all items visible in this move-out pile according to the instructions and schema.',
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'One sentence summarizing what was spotted in the photo.',
            },
            items: {
              type: Type.ARRAY,
              description: 'List of detected items in the photo.',
              items: {
                type: Type.OBJECT,
                properties: {
                  label: {
                    type: Type.STRING,
                    description: 'Specific descriptive name, e.g., "Ceramic space heater", "Blue fleece blanket"',
                  },
                  category: {
                    type: Type.STRING,
                    description: 'One of: blanket, laundry_basket, hangers, fan, heater, shoes, cleaning_supplies, clothing, other',
                  },
                  quantity: {
                    type: Type.INTEGER,
                    description: 'Estimated count of this item.',
                  },
                  condition: {
                    type: Type.STRING,
                    description: 'One of: good, worn, unclear',
                  },
                  confidence: {
                    type: Type.STRING,
                    description: 'One of: high, medium, low',
                  },
                  note: {
                    type: Type.STRING,
                    description: 'Brief observation on visible condition.',
                  },
                  needsConditionCheck: {
                    type: Type.BOOLEAN,
                    description: 'True if electrical appliance, heater, fan, shoes, or fragile item requiring student verification.',
                  },
                  conditionCheckQuestion: {
                    type: Type.STRING,
                    description: 'Clear question to confirm before donating, e.g. "Does the heater work, with no frayed wires or damage?"',
                  },
                },
                required: ['label', 'category', 'quantity', 'condition', 'confidence'],
              },
            },
          },
          required: ['items'],
        },
      },
    });

    const rawText = response.text || '{}';
    const parsed = JSON.parse(rawText);

    const items = (parsed.items || []).map((rawItem: any, index: number) => {
      let category: Category = 'other';
      if (ALLOWED_CATEGORIES.includes(rawItem.category?.toLowerCase())) {
        category = rawItem.category.toLowerCase() as Category;
      }

      const isRisky =
        category === 'heater' ||
        category === 'fan' ||
        category === 'shoes' ||
        rawItem.condition === 'unclear' ||
        rawItem.condition === 'worn';

      const needsCheck = rawItem.needsConditionCheck ?? isRisky;
      let question = rawItem.conditionCheckQuestion;

      if (needsCheck && !question) {
        if (category === 'heater') {
          question = 'Does the heater work, with no frayed wires or damage?';
        } else if (category === 'fan') {
          question = 'Does the fan operate properly and power on safely?';
        } else if (category === 'shoes') {
          question = 'Are the shoes clean and in wearable condition?';
        } else {
          question = `Is this ${rawItem.label || 'item'} clean and fully functional?`;
        }
      }

      return {
        id: `ai-item-${Date.now()}-${index}`,
        label: rawItem.label || 'Unlabeled Item',
        category,
        quantity: typeof rawItem.quantity === 'number' && rawItem.quantity > 0 ? rawItem.quantity : 1,
        condition: ['good', 'worn', 'unclear'].includes(rawItem.condition) ? rawItem.condition : 'good',
        confidence: ['high', 'medium', 'low'].includes(rawItem.confidence) ? rawItem.confidence : 'medium',
        note: rawItem.note || '',
        needsConditionCheck: needsCheck,
        conditionCheckQuestion: question,
        isConditionConfirmed: !needsCheck,
      };
    });

    return res.status(200).json({
      summary: parsed.summary || `Detected ${items.length} items from your photo.`,
      items,
    });
  } catch (error: any) {
    console.error('Vercel API Error in /api/analyze:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while analyzing the image.',
    });
  }
}
