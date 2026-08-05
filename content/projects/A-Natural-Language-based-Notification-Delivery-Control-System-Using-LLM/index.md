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


### 설명
- **프로젝트 이름**: LLM을 활용한 자연어 기반 알림 전송 제어 시스템 개발
- **프로젝트 기간**: 2025.07 ~ 2025.11
- **프로젝트 설명**: 사용자의 자연어 명령에서 알림 수신 조건과 대상을 추출하고, 조건에 맞는 알림만 선별적으로 전송하는 LLM 기반 모바일 알림 제어 시스템
- **프로젝트 목적**: 복잡한 수동 설정 과정과 머신러닝 기반 자동 예측의 부정확성을 개선하여 사용자가 자연어만으로 원하는 알림 수신 조건을 설정할 수 있도록 지원
- **데이터 출처**: 사용자 7명으로부터 수집한 자연어 명령 시나리오 24개
- **주요 설계 대상**: 시간·장소·활동을 나타내는 조건 필드와 앱·키워드를 나타내는 대상 필드
- **프로젝트 성과**: KSC 2025 논문 발표 및 Paper Accept

<br/>

### 프로젝트를 진행하며 느낀점
알림 관련 문제 상황을 제가 제일 관심이 많이 있는 LLM 모델과 결합하다가 나온 연구 주제입니다. 선배분과 함께 협업하면서 기획 부분은 크게 문제 없이 진행해왔지만, 이후 자료구조 설계와 사용자 조사, 그리고 개발 및 논문 작성까지 주도적으로 작성하게 되어서 힘들었지만 많이 배우고 성장할 수 있는 뜻깊은 시간이었습니다. 문제 분석 - 기획 - 해결 아이디어 탐색 - 개발 - 논문 작성 까지의 일련의 흐름을 거치니, 논문과 프로젝트의 퀄리티를 좌지우지하는 중요한 과정은 개발이 아닌 문제 분석과 기획임을 다시 한 번 느꼈습니다. 또한 개발을 진행하는 과정에서 Android 버전이 바뀌어 아이콘이 깨지는 문제를 한동안 해결하느라 고생했던 것 같습니다. 이러한 예상치 못했던 문제에 대한 트러블슈팅 과정 역시 저를 더 성장하게 해준 계기가 되었던 것 같습니다.