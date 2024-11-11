import { openaiConfig } from '@/src/config/openai.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import { DrawSandbarDto } from '../fortunes/dto/draw-sandbar.dto';
import { UserResponse } from '../auth/types/user.type';

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

    const interpretationText = response.choices[0].message.content.trim();

    return interpretationText;
  }

  async getNaming(mainTitle: string, content: string) {
    const prompt = `
    요청에 따라 이름을 작성하세요:
    1. JSON 형식으로 결과를 반환합니다. { "name": "추천 성함(한자 이름일 경우 성함의 한자표현도 같이 표현)", "description": "설명" } 
    2. ${content}에 맞게, ${mainTitle}이 사람이면 3글자로 성과 이름을 포함한 순수 한국 성함 (예: 김아름) 또는 한자 성함 (예: 강호동)으로 추천합니다.
    3. 성은 '김'입니다. 이름은 한글과 한자 표현을 모두 포함하여 3글자로 구성해주세요.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'AI 작명 요청 시스템입니다.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300,
    });

    const namingText = response.choices[0].message.content.trim();

    return namingText;
  }

  async getDreamInterpretation(title: string, description: string) {
    const prompt = `
    {
        "
         1. 주제는 ${title}, 내용은 ${description}인 꿈의 해석을 한국어로 작성해주세요.
         1. 꿈의 해석을 한국어로 작성해주세요.
         2. 말투를 재밌게 해줘요
         3. 현실적이고 실용적인 해석을 해주세요
         4. 300글자 이내로 작성해줘요
         5. 꿈의 내용에 따라 다른 해석을 해주세요
         6. 쉬운말 사용해주세요
        "
    }`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '꿈 해몽 요청 시스템입니다.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300,
    });

    const interpretationText = response.choices[0].message.content.trim();

    return interpretationText;
  }

  async getSandbar(userData: UserResponse, drawSandbarDto: DrawSandbarDto) {
    const prompt = `
    아래의 정보를 바탕으로 사주 명식을 계산해 주세요. 반드시 **JSON 형식**으로만 응답해 주세요.
    
    - 이름: ${userData.username}
    - 성별: ${userData.gender}
    - ${userData.calendar_type}: ${userData.birth_date} ${userData.birth_time} 
    - 사주 볼 날짜 범위: ${drawSandbarDto.start_date} ~ ${drawSandbarDto.end_date}
    
    ### 요구사항:
    1. 사주의 "year", "month", "day", "hour" 값은 **년주, 월주, 일주, 시주**의 기본 형식으로 고정하고 절대 변경하지 마세요.
    2. 응답은 다음과 같은 JSON 형식이어야 합니다.
    {
      "name": "홍길동",
      "gender": "남자",
      "birth": "1990-01-01 태어난 시간: 12:00:22 (양력)",
      "saJu": {
        "year": "년주",
        "month": "월주",
        "day": "일주",
        "hour": "시주"
      },
      "sipSeong": ["편재", "정재", "정관", "편관"],
      "cheonGan": [
        { "name": "갑", "element": "목" },
        { "name": "병", "element": "화" },
        { "name": "경", "element": "금" },
        { "name": "임", "element": "수" }
      ],
      "jiJi": [
        { "name": "자", "element": "수" },
        { "name": "축", "element": "토" },
        { "name": "인", "element": "목" },
        { "name": "묘", "element": "목" }
      ],
      "sipSeong_jiJi": ["편관", "정관", "식신", "상관"],
      "12UnSeong": ["제왕", "목욕", "절", "묘"],
      "12SinSal": ["천살", "재살", "천살", "재살"]
    }
    
    반드시 위 JSON 형식으로만 응답해 주세요. JSON 형식 이외의 텍스트는 포함하지 마세요.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '사주 명식 요청 시스템입니다.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content.trim();
    try {
      const sandbarData = JSON.parse(content);
      return sandbarData;
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      throw new Error('OpenAI가 유효한 JSON 응답을 반환하지 않았습니다.');
    }
  }
}
