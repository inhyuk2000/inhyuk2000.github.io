---
title: "LLM을 활용한 자연어 기반 알림 전송 제어 시스템 개발"
date: 2025-07-15
summary: "사용자의 자연어 명령에서 알림 수신 조건과 대상을 추출하고, 조건에 맞는 알림만 선별적으로 전송하는 LLM 기반 모바일 알림 제어 시스템"
tags: 
  - 학회
  - 팀
  - 연구실
  - HCI
tech_stack:
  - Python
  - JSON
  - CSV
  - ChatGPT
  - Groq API
  - Llama
  - Prompt Engineering
  - Query Rewriting
  - WikipediaLoader
  - Vector Store
  - TruthfulQA
links:
  - type: github
    url: https://github.com/inhyuk2000/A-Natural-Language-based-Notification-Delivery-Control-System-Using-LLM
    label: Code
  - type: paper
    url: https://drive.google.com/file/d/1X0MEcAVbjpO4GJgVm3I3grggdpTGKmQK/view
    label: Paper
  - type: paper
    url: https://drive.google.com/file/d/1WVwluJ32EkZljldSVt6CZtasL6YWRNNw/view
    label: Poster
featured: true
status: "Done"
role: "논문 제 1저자"
duration: "4 months"
team_size: 2
highlights:
  - "Handles 10k+ concurrent users"
  - "99.9% uptime SLA"
  - "Processing $50k+ monthly transactions"
  - "60% faster page load vs competitors"
---

#### 📄 Paper

> **KSC 2025 Paper Accept**

📑 [Research Paper (PDF)](https://drive.google.com/file/d/1X0MEcAVbjpO4GJgVm3I3grggdpTGKmQK/view)

#### 🖼️ Poster

> **KCC 2025 Conference Poster**

📄 [Poster (PDF)](https://drive.google.com/file/d/1WVwluJ32EkZljldSVt6CZtasL6YWRNNw/view)


### 요약
- **프로젝트 이름**: LLM을 활용한 자연어 기반 알림 전송 제어 시스템 개발
- **프로젝트 기간**: 2025.07 ~ 2025.11
- **프로젝트 설명**: 사용자의 자연어 명령에서 알림 수신 조건과 대상을 추출하고, 조건에 맞는 알림만 선별적으로 전송하는 LLM 기반 모바일 알림 제어 시스템
- **프로젝트 목적**: 복잡한 수동 설정 과정과 머신러닝 기반 자동 예측의 부정확성을 개선하여 사용자가 자연어만으로 원하는 알림 수신 조건을 설정할 수 있도록 지원
- **데이터 출처**: 사용자 7명으로부터 수집한 자연어 명령 시나리오 24개
- **주요 설계 대상**: 시간·장소·활동을 나타내는 조건 필드와 앱·키워드를 나타내는 대상 필드
- **프로젝트 성과**: KSC 2025 논문 발표 및 Paper Accept

<br/>

### 자료구조 시나리오 설계 과정
사용자의 자연어를 Function Calling 기능을 활용해 JSON 구조로 변환해야겠다고 결정했을 때, 두 가지 조건을 결정해야 했습니다. 따라서 {{% high_mark %}}**"알림을 언제 보내줘야 하지?"**{{% /high_mark %}}, {{% high_mark %}}**"어떤 유형의 알림을 보내줘야 하지?"**{{% /high_mark %}} 와 같은 결정을 내리기 위해서, 저는 8명의 참여자들로부터 총 24개의 질문 시나리오를 받고, 이를 바탕으로 가능한 JSON 구조를 설계했습니다.

#### JSON Schema 설계

참여자들의 자연어 명령을 분석한 결과, 알림 제어에 필요한 정보는 크게 **알림 대상(Notification Target)** 과 **알림 조건(Notification Condition)** 으로 구분할 수 있었습니다.

| Category | Field | Description |
|----------|-------|-------------|
| **Notification Target** | `name` | 앱 이름을 기반으로 알림을 필터링 |
|  | `content` | 알림 제목 및 본문의 키워드를 기반으로 알림을 필터링 |
| **Notification Condition** | `time.relative` | 현재 시점을 기준으로 한 상대 시간 (예: 5분 후) |
|  | `time.absolute` | 특정 절대 시간 (예: 오후 3시) |
|  | `activity` | 사용자의 현재 활동 |
|  | `location` | 사용자의 현재 위치 |

이를 바탕으로 다음과 같은 JSON 구조를 설계했습니다.

```json
{
  "extract_notification_target": {
    "name": [],
    "content": []
  },
  "extract_notification_condition": {
    "time": {
      "relative": "",
      "absolute": ""
    },
    "activity": "",
    "location": ""
  }
}
```

### 작동 시스템 설계
이후 사용자의 자연어 명령을 위와 같이 JSON 자료구조로 변환하는 {{% high_mark %}}**NotificationParser**{{% /high_mark %}}와 데이터베이스에 저장된 알림 내용들과 조건 목록들을 모니터링하는 {{% high_mark %}}**ContextManager**{{% /high_mark %}}를 두 핵심 기능으로 삼아 개발을 진행했습니다.

### 트러블슈팅 과정
해당 기능을 구현한 뒤 실제 환경에서 테스트하는 과정에서 예상치 못한 문제가 발생했습니다. 2025년 4월 One UI 7 업데이트 이후 **알림에 표시되는 앱 아이콘이 시스템에 의해 임의로 변경**되었으며, 삼성의 내부 프레임워크가 공개되어 있지 않아 코드 수정만으로는 기존과 동일한 smallIcon을 가져올 수 없었습니다.

약 2개월간 다양한 해결 방법을 검토했지만, 최종적으로 애플리케이션 코드 수준에서는 해결하기 어렵다는 결론에 도달했습니다. 이에 {{% high_mark %}}**시스템 설정에서 알림 표시 방식을 이전 버전과 유사하게 변경하는 방법을 사용자에게 안내하는 방식으로 우회책을 마련**{{% /high_mark %}}했습니다. 이를 통해 개발 과정에서는 코드 개선뿐만 아니라 플랫폼의 제약을 파악하고, 제한된 환경 안에서 사용자 경험을 보완할 수 있는 현실적인 대안을 찾는 것 역시 중요하다는 점을 배웠습니다.

### 프로젝트를 진행하며 느낀점
알림 관련 문제 상황을 제가 제일 관심이 많이 있는 LLM 모델과 결합하다가 나온 연구 주제입니다. 선배분의 아이디어 기획 능력으로 초반 아이디어 구체화 부분은 수월하게 진행되었지만, 이후 자료구조 설계와 사용자 조사, 그리고 개발 및 논문 작성까지 주도적으로 작성하게 되어서 힘들었지만 많이 배우고 성장할 수 있는 뜻깊은 시간이었습니다. 문제 분석 - 기획 - 해결 아이디어 탐색 - 개발 - 논문 작성 까지의 일련의 흐름을 거치니, 논문과 프로젝트의 퀄리티를 좌지우지하는 중요한 과정은 개발이 아닌 {{% high_mark %}}**문제 분석과 기획**{{% /high_mark %}}임을 다시 한 번 느꼈습니다. 또한 개발을 진행하는 과정에서 Android 버전이 바뀌어 아이콘이 깨지는 문제를 한동안 해결하느라 고생했던 것 같습니다. 이러한 예상치 못했던 문제에 대한 {{% high_mark %}}**트러블슈팅 과정**{{% /high_mark %}} 역시 저를 더 성장하게 해준 계기가 되었던 것 같습니다.