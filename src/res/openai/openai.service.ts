import { openaiConfig } from '@/src/config/openai.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import { GetTodayFortunesType } from '../fortunes/types/get-today-fortunes.type';
import { ZodiacFortuneEntity } from '../fortunes/entities/zodiac_fortune.entity';
import { StarSignFortuneEntity } from '../fortunes/entities/star_sign_fortune.entity';

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
      "interpretation": "아래 조건에 맞게 JSON 형식으로 작성해주세요. JSON 예시는 다음과 같습니다: {
        'name': '${cardName}',
        'meaning': '${meaning}',
        'subTitle': '${subTitle}',
        'interpretation': '카드 해석 내용'
      }
      조건:
      1. 타로 카드의 해석을 subTitle에 맞게 한국어로 작성해주세요.
      2. 말투를 재밌게 해주세요.
      3. 현실적이고 실용적인 해석을 해주세요.
      4. 300글자 이내로 작성해주세요.
      5. subTitle에 따라 다른 해석을 해주세요.
      6. subTitle이 '연애운'일 경우 연애 중인 사람과 연애 중이 아닌 사람 모두에 대한 해석을 작성해주세요.
      7. 쉬운말을 사용해주세요."
    }`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '타로 카드 해석 요청 시스템입니다.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' }, // JSON 형식을 강제
      max_tokens: 500,
    });

    const interpretationText = response.choices[0].message.content.trim();

    try {
      const interpretationData = JSON.parse(interpretationText);
      return interpretationData;
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      throw new Error('OpenAI가 유효한 JSON 응답을 반환하지 않았습니다.');
    }
  }

  async getNaming(mainTitle: string, content: string) {
    const prompt = `
    요청에 따라 이름을 작성하세요:
    1. ${content}에 맞게, ${mainTitle}을(를) 작성하세요.
       - 사람이면 3글자의 순수 한국 성함 또는 한자 성함 (예: 김하람, 金夏藍)으로 추천하며, 이름은 성 '김, 이 등등'을 포함합니다.
       - 예로 ${content}에 부모님 성이 있을 경우 성은 해당 성을 사용합니다.
       - 사람이 아닐 경우(반려동물, 아이디어, 제품명, 상호명, 회사명)는 한국어 이름만 추천합니다.
    2. 각 이름에 대한 설명을 포함하세요. 
       - 사람이면 이름과 한자 표현에 대한 의미와 배경을 설명합니다.
       - 다른 경우는 이름이 왜 적합한지 설명합니다.
    3. **JSON 형식으로만 답변하세요. 아래 예제를 준수하세요:**
    [
      {
        "name": "추천 성함",
        "hanja": "한자 이름" || null,
        "description": "설명"
      },
      {
        "name": "추천 성함",
        "hanja": "한자 이름" || null,
        "description": "설명"
      }
    ]
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'AI 작명 요청 시스템입니다.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
    });

    const resContent = response.choices[0].message.content.trim();
    try {
      const namingText = JSON.parse(resContent);

      namingText.forEach((item) => {
        if (mainTitle !== '사람') {
          item.hanja = null;
        }
      });

      return namingText;
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      throw new Error('OpenAI가 유효한 JSON 응답을 반환하지 않았습니다.');
    }
  }

  async getDreamInterpretation(title: string, description: string) {
    const prompt = `
    꿈 해몽을 JSON 형식으로 작성해주세요. 아래 형식을 참고하세요:
    {
      "title": "${title}",
      "description": "${description}",
      "interpretation": "꿈 해몽 내용"
    }
  
    조건:
    1. 꿈의 주제는 "${title}"이고, 내용은 "${description}"입니다.
    2. 꿈의 해석을 한국어로 작성해주세요.
    3. 해석을 재미있고 유머러스한 말투로 작성해주세요.
    4. 현실적이고 실용적인 관점을 포함해주세요.
    5. 해석은 300자 이내로 작성해주세요.
    6. 주제와 내용에 따라 적절한 해석을 작성해주세요.
    7. 누구나 이해할 수 있도록 쉬운 표현을 사용해주세요.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '꿈 해몽 요청 시스템입니다.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' }, // JSON 형식을 강제
      max_tokens: 300,
    });

    try {
      const interpretationData = response.choices[0].message.content.trim();
      return JSON.parse(interpretationData);
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      throw new Error('OpenAI가 유효한 JSON 응답을 반환하지 않았습니다.');
    }
  }

  async getTodayFortunes(fortunesData: GetTodayFortunesType) {
    const fortune = fortunesData.fortunesData;

    const prompt = `
    1. 다음은 사용자 사주 정보입니다:
    {
      "천간에 대한 십성": {
        "년주": "${fortune.heavenlyStemTenGod.year}",
        "월주": "${fortune.heavenlyStemTenGod.month}",
        "일주": "${fortune.heavenlyStemTenGod.day}",
        "시주": "${fortune.heavenlyStemTenGod.hour}"
      },
      "천간": {
        "년주": "${fortune.heavenly.year}, ${fortune.heavenly.elements.baseElements.year}",
        "월주": "${fortune.heavenly.month}, ${fortune.heavenly.elements.baseElements.month}",
        "일주": "${fortune.heavenly.day}, ${fortune.heavenly.elements.baseElements.day}",
        "시주": "${fortune.heavenly.hour}, ${fortune.heavenly.elements.baseElements.hour}"
      },
      "지지": {
        "년주": "${fortune.earthly.year}, ${fortune.earthly.elements.baseElements.year}",
        "월주": "${fortune.earthly.month}, ${fortune.earthly.elements.baseElements.month}",
        "일주": "${fortune.earthly.day}, ${fortune.earthly.elements.baseElements.day}",
        "시주": "${fortune.earthly.hour}, ${fortune.earthly.elements.baseElements.hour}"
      }
    }
    2. 위의 사주 정보를 활용하여 아래 질문에 대답해주세요:
      - 총운
      - 재물운
      - 연애운
      - 사업운
      - 건강운
      - 학업운
      - 행운을 가져오는 것들 예(김밥, 빨간색)
      - 행운의 코디 제안
    
    3. **JSON 형식으로만 답변하세요. 아래 예제를 준수하세요:**
      {
        "generalFortune": "총운 해석",
        "wealthFortune": "재물운 해석",
        "loveFortune": "연애운 해석",
        "careerFortune": "사업운 해석",
        "healthFortune": "건강운 해석",
        "studyFortune": "학업운 해석",
        "luckyElements": ["행운의 요소 1", "행운의 요소 2"],
        "luckyOutfit": "행운의 코디 아이템 또는 색상 등"
      }
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '사주 명식 요청 시스템입니다.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' }, // JSON 형식을 강제
      max_tokens: 1000, // 토큰 수 증가
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

  async getZodiacFortunes(zodiacFortune: ZodiacFortuneEntity, today: number) {
    const startYear = zodiacFortune.start_year;
    const cycle = zodiacFortune.cycle;

    const yearList = [];
    for (
      let year = startYear + 12 * 2;
      Number(year) <= Number(today);
      year += cycle
    ) {
      yearList.push(year);
    }

    const prompt = `
    1. 사용자의 띠 정보:
    {
      "띠 이름": "${zodiacFortune.name}",
      "띠 정보": "${zodiacFortune.info}",
      "해당 띠의 연도들": [${yearList.join(', ')}],
      "오늘 날짜": "${today}"
    }
    
    2. 위의 띠 정보를 활용하여 오늘 날짜를 대입하여 아래 질문에 대답해주세요:
      - ${zodiacFortune.name}의 특징에 대한 설명
      - ${zodiacFortune.name}의 띠를 가진 사람들의 공통적인 특징
      - 오늘 날짜와 해당 띠의 연도별 특징을 대입하여 오늘의 운세를 알려주세요
    
    3. JSON 형식으로 다음 포맷에 맞게 응답해주세요:
    {
      "zodiacGeneral": "해당 띠의 공통적인 설명",
      "zodiacToday": "오늘 날짜를 대입한 ${zodiacFortune.name}에 대한 운세",
      "yearlyFortunes": {
        ${yearList.map((year) => `"${year}": "해당 연도에 속한 ${zodiacFortune.name} 띠의 특징"`).join(',\n')}
      }
    }
    4. 반드시 올바른 JSON 형식으로 응답해주세요. 문자열은 큰따옴표(")를 사용하며, JSON이 올바르지 않을 경우 요청이 실패로 간주됩니다.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '띠 운세 요청 시스템입니다.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' }, // JSON 형식을 강제
      max_tokens: 500,
    });
    const content = response.choices[0].message.content.trim();
    try {
      const getZodiacFortunesData = JSON.parse(content);
      return getZodiacFortunesData;
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      throw new Error('OpenAI가 유효한 JSON 응답을 반환하지 않았습니다.');
    }
  }

  async getConstellationFortunes(constellation: StarSignFortuneEntity) {
    const prompt = `
      1. 사용자의 별자리 정보:
      {
        "별자리 이름": "${constellation.name}",
      }

      2. 위의 별자리 정보를 활용하여 아래 질문에 대답해주세요:
        - ${constellation.name}의 오늘의 별자리를 가진 사람들의 공통적인 특징
        - ${constellation.name}의 오늘의 운세를 알려주세요

      3. JSON 형식으로 다음 포맷에 맞게 응답해주세요.
      ### 출력 포맷 (JSON 형식):
      {
        "constellationGeneral": "해당 별자리의 공통적인 설명",
        "constellationToday": "오늘의 ${constellation.name} 별자리 운세 설명"
      }
      4. 강력: 정확한 JSON 형식으로 응답하세요.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '별자리 운세 요청 시스템입니다.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' }, // JSON 형식을 강제

      max_tokens: 500,
    });

    const content = response.choices[0].message.content.trim();
    try {
      const getConstellationFortunesData = JSON.parse(content);
      return getConstellationFortunesData;
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      throw new Error('OpenAI가 유효한 JSON 응답을 반환하지 않았습니다.');
    }
  }
}
