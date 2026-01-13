import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    // Get OpenAI configuration from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL;
    const model = process.env.AI_MODEL || "gemini-2.0-flash";

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured on the server" },
        { status: 500 },
      );
    }

    // Initialize OpenAI client with environment variables
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseUrl || undefined,
      defaultHeaders: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    // Get the form data (multipart/form-data)
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    // Convert the file to a base64 data URL
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataUrl = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

    // Define system prompt for combined extraction
    const systemPrompt =
      '从图片中采样8个主要颜色，并分析图片颜色，提取4组可用于渐变的颜色对（起始色和结束色）。返回内容必须是一个严格的JSON对象，不包含任何其他文本或注释。结构为：{"colors": ["#RRGGBB", ...], "gradients": [{"start": "#RRGGBB", "end": "#RRGGBB"}, ...]}。严格使用JSON格式返回。';

    // Call OpenAI API to extract colors
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    // Extract JSON response from OpenAI
    const content = response.choices[0]?.message?.content || "";

    // Clean and parse the JSON response
    let colorData: { colors: string[]; gradients: Array<{ start: string; end: string }> } = {
      colors: [],
      gradients: [],
    };

    try {
      // Try to parse the entire content as JSON first
      const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim());
      colorData = parsed;
    } catch {
      // If that fails, try to extract JSON using regex
      const colorsMatch = content.match(/"colors"\s*:\s*(\[[\s\S]*?\])/);
      const gradientsMatch = content.match(/"gradients"\s*:\s*(\[[\s\S]*?\])/);

      if (colorsMatch) {
        try {
          colorData.colors = JSON.parse(colorsMatch[1]);
        } catch {
          /* ignore */
        }
      }
      if (gradientsMatch) {
        try {
          colorData.gradients = JSON.parse(gradientsMatch[1]);
        } catch {
          /* ignore */
        }
      }

      if (colorData.colors.length === 0 && colorData.gradients.length === 0) {
        return NextResponse.json(
          { error: "Failed to extract color data from AI response", raw: content },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      colors: colorData.colors || [],
      gradients: colorData.gradients || [],
    });
  } catch (error: any) {
    console.error("Error extracting colors:", error);

    // Return a more descriptive error if it's from the AI provider
    const status = error.status || 500;
    const message = error.message || "Failed to extract colors";

    return NextResponse.json(
      { error: message, details: error.error || undefined },
      { status: status },
    );
  }
}
