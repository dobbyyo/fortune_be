import { openaiConfig } from '@/src/config/openai.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(
    @Inject(openaiConfig.KEY)
    private config: ConfigType<typeof openaiConfig>,
  ) {
    this.openai = new OpenAI({
      apiKey: this.config.OPENAI_API_KEY,
    });
  }

  async getTarotCardInterpretation(
    cardName: string,
    meaning: string,
    subTitle: string,
  ) {
    const prompt = `{
    "name": "${cardName}",
    "meaning": "${meaning}",
    "subTitle": "${subTitle}",
    "interpretation": 
      "
       1. 타로 카드의 해석을 subTitle에 맞게 한국어로 작성해주세요.
       2. 말투를 재밌게 해줘요
       3. 현실적이고 실용적인 해석을 해주세요
       4. 300글자 이내로 작성해줘요
       5. subTitle에 따라 다른 해석을 해주세요
       6. subTitle이 연애운일 경우 연애중인 사람과, 연애중이 아닌 사람에 대한 해석을 해주세요.
       7. 쉬운말 사용해주세요
      "
    }`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '타로 카드 해석 요청 시스템입니다.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
    });

    // return response.choices[0].message.content.trim();
    const interpretationText = response.choices[0].message.content.trim();

    return interpretationText;
  }
}
