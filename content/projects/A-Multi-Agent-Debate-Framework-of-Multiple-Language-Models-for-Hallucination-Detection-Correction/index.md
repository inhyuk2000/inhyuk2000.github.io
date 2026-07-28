---
title: "다중 언어 모델 기반 멀티 에이전트 챗봇 토론 프레임워크를 통한 환각 탐지 및 교정"
date: 2025-07-15
summary: "서로 다른 LLM이 독립적으로 생성한 답변을 비교하고, 답변이 일치하지 않을 경우 토론을 통해 상호 검증하는 멀티 에이전트 프레임워크"
tags: 
  - 학회
  - 팀
  - 연구
tech_stack:
  - Python
  - Javascript
  - HTML5
  - CSS3
  - API
  - Excel
  - Github
links:
  - type: github
    url: https://github.com/inhyuk2000/A-Multi-Agent-Debate-Framework-of-Multiple-Language-Models-for-Hallucination-Detection-Correction
    label: Code
  - type: paper
    url: https://drive.google.com/file/d/1q8yfzXqd31LKVdXK5JN_vYRBYoJjJf0D/view
    label: Paper
  - type: pdf
    url: https://drive.google.com/thumbnail?id=1z1awg9RXY8ONrvvl2OFhBLXKMn80SIZH&sz=w2000
    label: Poster
  - type: live
    url: https://drive.google.com/file/d/14KXFnR415BbbJ_B9oexl76601NYtoaFU/view
    label: Award
featured: true
status: "Live"
role: "논문 1저자"
duration: "4 months"
team_size: 2
highlights:
  - "Handles 10k+ concurrent users"
  - "99.9% uptime SLA"
  - "Processing $50k+ monthly transactions"
  - "60% faster page load vs competitors"
---

<a href="시연 영상 링크" target="_blank">
  <img
    src="https://drive.google.com/thumbnail?id=1z1awg9RXY8ONrvvl2OFhBLXKMn80SIZH&sz=w2000"
    alt="멀티 에이전트 토론 프레임워크 배너"
    width="100%"
  />
</a>

<br/>
<br/>

## 📄 Paper

> **다중 언어 모델 기반 멀티 에이전트 챗봇 토론 프레임워크를 통한 환각 탐지 및 교정**

📑 [Research Paper (PDF)](https://drive.google.com/file/d/1q8yfzXqd31LKVdXK5JN_vYRBYoJjJf0D/view)

## 🏆 Award

> **KCC 2025 Best Poster Award (최우수상)**

🏅 [Award Certificate](https://drive.google.com/file/d/14KXFnR415BbbJ_B9oexl76601NYtoaFU/view)

<br/>
<br/>

# 1. Project Overview (프로젝트 개요)

- **프로젝트 이름**: 다중 언어 모델 기반 멀티 에이전트 챗봇 토론 프레임워크를 통한 환각 탐지 및 교정
- **프로젝트 기간**: 2025.03 ~ 2025.07
- **프로젝트 설명**: 서로 다른 LLM이 독립적으로 생성한 답변을 비교하고, 답변이 일치하지 않을 경우 토론을 통해 상호 검증하는 멀티 에이전트 프레임워크
- **프로젝트 목적**: 단일 모델의 학습 데이터 편향과 자체 검증 기능 부족으로 발생하는 환각 문제를 완화하고 답변의 정확성과 논리적 일관성을 향상
- **검증 데이터**: 2025학년도 대학수학능력시험 전 문항
- **주요 분석 대상**: 모델 간 답변이 달랐던 수능 66문항
- **프로젝트 성과**: KCC 2025 논문 발표 및 Best Poster Award 수상

<br/>
<br/>

# 2. Team Members (팀원 및 팀 소개)

| 송인혁 | 공동 연구자 |
|:------:|:-----------:|
| 제1저자 | 공동 저자 |
| 문제 정의 및 연구 기획 | 연구 및 실험 지원 |
| 토론 프레임워크 설계 | 결과 검토 |
| Chrome Extension 개발 | 논문 작성 지원 |
| 성능 평가 및 결과 분석 | 공동 연구 수행 |
| [GitHub](https://github.com/inhyuk2000) | GitHub 링크 |

<br/>
<br/>

# 3. Key Features (주요 기능)

- **다중 LLM 답변 생성**
  - GPT-4o mini와 Gemini 2.0 Flash가 동일한 질문에 독립적으로 답변합니다.
  - 서로 다른 모델의 답변을 활용해 교차 검증을 수행합니다.

- **답변 불일치 탐지**
  - 두 모델이 생성한 답변과 선택지를 비교합니다.
  - 답변이 일치하지 않으면 사용자에게 토론 진행 여부를 안내합니다.

- **사용자 동의 기반 토론**
  - 사용자가 토론 진행 여부를 직접 선택할 수 있습니다.
  - 불필요한 토론을 방지하고 사용자 중심의 상호작용 흐름을 제공합니다.

- **역할 분담형 멀티 에이전트 구조**
  - 논의 챗봇은 서로의 답변과 추론 근거를 검토합니다.
  - 모더레이터는 토론 순서와 대화 흐름을 관리합니다.
  - 저지 챗봇은 모델 간 답변과 최종 결론을 검토합니다.

- **토론 과정 시각화**
  - Chrome Extension 화면에서 모델별 주장과 토론 과정을 확인할 수 있습니다.
  - 이전 대화 맥락을 유지하며 토론 내용을 순차적으로 출력합니다.

- **추가 토론 기능**
  - 첫 번째 토론 결과의 근거가 부족한 경우 추가 토론을 진행할 수 있습니다.
  - 이전 결론의 취약점을 보완하기 위한 추가 프롬프트를 제공합니다.

- **최종 답변 요약**
  - 토론 종료 후 모델 간 합의 내용과 최종 답변을 사용자에게 제공합니다.

<br/>
<br/>

# 4. Tasks & Responsibilities (작업 및 역할 분담)

| 담당자 | 역할 | 주요 업무 |
|:------:|:----:|:---------|
| 송인혁 | 제1저자 | 문제 정의 및 연구 아이디어 기획 |
| 송인혁 | 시스템 설계 | 역할 분담형 멀티 에이전트 토론 구조 설계 |
| 송인혁 | 프레임워크 개발 | LLM API 연동 및 토론 파이프라인 구현 |
| 송인혁 | Extension 개발 | 답변 불일치 알림창 및 토론 과정 UI 구현 |
| 송인혁 | 실험 설계 | 2025학년도 수능 데이터 기반 검증 방식 설계 |
| 송인혁 | 데이터 분석 | 모델별 초기 답변과 토론 후 결과 비교 |
| 송인혁 | 논문 작성 | 실험 결과 분석, 논문 작성 및 학회 발표 |

## 기여도

- 논문 제1저자
- 아이디어 기획: **100%**
- 토론 프레임워크 및 Chrome Extension 개발: **80%**
- 성능 평가 및 검증: **80%**

<br/>
<br/>

# 5. Technology Stack (기술 스택)

## 5.1 Language

| 기술 | 활용 내용 |
|:----:|:---------|
| Python | LLM API 연동, 토론 파이프라인 및 성능 평가 구현 |
| JavaScript | Chrome Extension 인터페이스 및 사용자 상호작용 구현 |
| HTML5 | 답변 불일치 알림창과 토론 대화창 구성 |
| CSS3 | Chrome Extension UI 스타일링 |

<br/>

## 5.2 LLM & API

| 기술 | 활용 내용 |
|:----:|:---------|
| OpenAI API | 기본 챗봇, 논의 챗봇 및 모더레이터 구성 |
| Google Gemini API | 이종 모델 기반 답변 생성 및 토론 수행 |
| Perplexity API | 답변 검토 및 저지 챗봇 구성 |

<br/>

## 5.3 Platform & Analysis

| 기술 | 활용 내용 |
|:----:|:---------|
| Chrome Extension | 기존 챗봇 환경에 답변 비교 및 토론 기능 제공 |
| Excel | 문항별 초기 답변과 토론 수행 결과 정리 |
| GitHub | 소스 코드 및 프로젝트 문서 관리 |

<br/>
<br/>

# 6. Project Structure (프로젝트 구조)

```plaintext
project/
├── extension/
│   ├── manifest.json
│   ├── content.js
│   ├── background.js
│   ├── popup.html
│   ├── popup.js
│   └── styles.css
│
├── server/
│   ├── app.py
│   ├── agents/
│   │   ├── discussion_agent.py
│   │   ├── judge_agent.py
│   │   └── moderator_agent.py
│   │
│   ├── debate/
│   │   ├── answer_compare.py
│   │   ├── debate_manager.py
│   │   └── result_summary.py
│   │
│   └── prompts/
│       ├── discussion_prompt.py
│       ├── judge_prompt.py
│       └── moderator_prompt.py
│
├── data/
│   ├── csat_2025.xlsx
│   └── debate_results.xlsx
│
├── analysis/
│   ├── performance_analysis.py
│   └── error_analysis.py
│
├── docs/
│   ├── paper.pdf
│   └── presentation.pdf
│
├── requirements.txt
├── .env.example
└── README.md
```

<br/>
<br/>

# 7. Development Workflow (개발 워크플로우)

## 7.1 문제 정의

- 실제 LLM 서비스에서 발생한 수능 문항 답변 오류 확인
- 환각 탐지·방지·교정 관련 선행 연구 검토
- 단일 모델 기반 검증 방식의 한계와 Research Gap 구체화

## 7.2 프레임워크 설계

- 기본 챗봇, 논의 챗봇, 저지 챗봇, 모더레이터 역할 정의
- 모델 간 답변 비교 및 토론 진행 조건 설계
- Turn Taking 문제를 고려한 2개 논의 모델 구성

## 7.3 시스템 개발

- LLM API를 연동한 토론 파이프라인 구현
- 사용자 동의 기반 답변 불일치 알림창 개발
- 토론 과정과 최종 결론을 제공하는 Chrome Extension 개발

## 7.4 실험 및 데이터 분석

- 2025학년도 수능 전 문항에 대해 모델별 초기 답변 수집
- 답변이 달랐던 66문항을 대상으로 토론 수행
- 초기 답변과 토론 후 결과를 문항별로 정리
- 동일 모델과 이종 모델 기반 토론 결과 비교

## 7.5 논문 작성 및 발표

- 연구 결과 정량·정성 분석
- 제1저자로 논문 작성
- KCC 2025 학술대회 발표
- Best Poster Award 수상

<br/>
<br/>

# 8. Project Results (프로젝트 성과)

- 2025학년도 수능 전 문항 분석 결과, 전체 문항 중 **32%에서 한 개 이상의 모델이 오답을 생성**하는 현상을 확인했습니다.
- 둘 중 한 모델만 오답인 경우 토론 후 정답 도달 비율이 **75%에서 97%로 향상**되었습니다.
- 두 모델이 모두 오답인 경우에도 정답 도달 비율이 **0%에서 25%로 향상**되었습니다.
- 서로 다른 모델을 활용한 토론이 동일 모델 기반 토론보다 높은 답변 교정 효과를 보였습니다.
- 계산 오류, 자료 해석 오류, 개념 혼동 등 다양한 추론 오류가 토론 과정에서 수정되는 것을 확인했습니다.
- 연구 결과를 논문으로 발전시켜 **KCC 2025 Best Poster Award**를 수상했습니다.

<br/>
<br/>

# 9. Limitations & Future Work (한계점 및 향후 발전 방향)

- 토론 성능 차이에 대한 통계적 유의성 검정 보완
- 객관식 문항을 넘어 비정형·개방형 질문으로 검증 범위 확대
- 두 모델이 동일한 오답을 생성하는 경우를 탐지할 외부 검증 방식 추가
- 문제 유형과 도메인에 따른 최적 모델 조합 연구
- 불필요한 토론을 줄이기 위한 토론 실행 조건 고도화
