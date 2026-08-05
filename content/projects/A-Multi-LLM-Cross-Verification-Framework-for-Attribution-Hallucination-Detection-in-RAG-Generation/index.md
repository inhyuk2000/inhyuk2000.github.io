---
title: "멀티 LLM RAG 교차 검증을 통한 생성 단계의 근거 귀속 환각 탐지"
date: 2025-07-15
summary: "동일한 검색 문서를 기반으로 서로 다른 LLM이 독립적으로 답변을 생성하고, 답변 불일치 시 문서 인용 기반의 상호 평가와 토론을 수행하는 멀티 LLM 기반 출처 환각 탐지 시스템"
tags: 
  - 개인
  - 졸업 프로젝트
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
    url: https://github.com/inhyuk2000/A-Multi-LLM-Cross-Verification-Framework-for-Attribution-Hallucination-Detection-in-RAG-Generation
    label: Code
  - type: paper
    url: https://drive.google.com/file/d/1lJwaTsDuXqUsFMLFv8uWvke54X24SNsS/view
    label: Paper
featured: true
status: "Hold"
role: "프로젝트 전체 담당 및 논문 작성"
duration: "4 months"
team_size: 1
highlights:
  - "Handles 10k+ concurrent users"
  - "99.9% uptime SLA"
  - "Processing $50k+ monthly transactions"
  - "60% faster page load vs competitors"
---

#### 📄 Paper

> **멀티 LLM RAG 교차 검증을 통한 생성 단계의 근거 귀속 환각 탐지**

📑 [Research Paper (PDF)](https://drive.google.com/file/d/1lJwaTsDuXqUsFMLFv8uWvke54X24SNsS/view)

<br/>

### 설명
- **프로젝트 이름**: 멀티 LLM RAG 교차 검증을 통한 생성 단계의 근거 귀속 환각 탐지
- **영문 제목**: A Multi-LLM Cross-Verification Framework for Attribution Hallucination Detection in RAG Generation
- **프로젝트 설명**: 동일한 검색 문서를 기반으로 서로 다른 LLM이 독립적으로 답변을 생성하고, 답변 불일치 시 문서 인용 기반의 상호 평가와 토론을 수행하는 멀티 LLM 기반 출처 환각 탐지 시스템
- **프로젝트 목적**: RAG의 답변 생성 단계에서 답변의 주장과 검색 문서가 부적절하게 연결되는 근거 귀속 환각을 탐지하고, 단일 LLM 평가 방식의 편향과 검증 한계를 보완
- **검증 데이터**: TruthfulQA 데이터셋에서 선별한 50개 문항
- **비교 모델**: ChatGPT 계열 모델, Groq 기반 LLaMA 계열 모델
- **주요 검증 대상**: 생성 답변, 직접 인용 문장, 답변과 문서 근거 간의 귀속 적합성
- **주요 성과**: 두 모델 중 한 모델만 오답인 문항에서 토론을 통해 출처 환각을 탐지하고 답변을 교정하는 효과 확인

<br/>

### 프로젝트를 진행하며 느낀점
멀티 에이전트 챗봇 토론 시스템을 활용한 환각 교정 서비스를 개발하면서, 환각에 대해 공부하다보니 연구를 더 발전시켜야 할 부분이 있음을 알게 되었습니다. *출처 환각* 역시 사고 과정에서 벌어지는 일반적인 환각처럼 굉장히 비일비재하게 일어나는 문제였고, 이를 해결하고자 본 프로젝트를 진행하게 되었습니다. 각 챗봇들에게 RAG 시스템을 갖추게 해서, 상대 챗봇의 답변의 출처를 검증하도록 함으로써 *출처 환각*을 예방하는 것을 목표로 삼았지만, 어떻게 데이터를 설계해야하고 어떤 과정으로 검증을 해야 할지에 대한 고민이 많아 교수님과 의논하는 시간이 많았었습니다. 결국 Prompt Engineering과 LLM 대화 구조를 더 상세히 만듦으로써 의미 있는 성능 개선을 이뤄내어 논문화할 수 있었습니다. 아직 한계점이 많이 남아있지만, 추후에 개선해보면서 연구를 다듬을 생각입니다.