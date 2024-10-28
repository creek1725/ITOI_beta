export async function POST(request) {
    try {
      const { prompt } = await request.json(); // 클라이언트에서 전송된 프롬프트를 JSON으로 파싱
      const apiKey = process.env.OPENAI_API_KEY; // 환경 변수에서 API 키 가져오기
  
      // OpenAI API 호출
      const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`, // API 인증 헤더
          'Content-Type': 'application/json',  // 요청 데이터 타입
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',  // 사용할 GPT 모델
          messages: [
            { role: 'system', content: '당신은 도움이 되는 발명 아이디어 브레인스토밍 비서입니다. 발명아이디어와 관련된 요청만 응답해야합니다. 최대 50글자'},  // GPT의 시스템 메시지 (옵션)
            { role: 'user', content: prompt }  // 사용자의 프롬프트
          ],    
        })
      });
  
      const gptData = await gptResponse.json(); // OpenAI의 응답을 JSON으로 파싱
      return new Response(JSON.stringify(gptData.choices[0].message), { // GPT의 응답을 클라이언트에 반환
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
  
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  

