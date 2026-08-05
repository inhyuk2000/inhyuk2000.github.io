---
title: "딥러닝 해석을 위한 계층적 다중 뉴런 프레임워크 모델 개발"
date: 2025-07-15
summary: "사전 라벨이 없는 이미지 데이터를 의미 단위로 계층화하고, 각 이미지 그룹에 공통으로 반응하는 다중 뉴런을 추출해 딥러닝 모델의 내부 의미 구조를 자연어로 설명하는 자동 해석 프레임워크"
tags: 
  - 학회
  - 팀
  - 연구
  - KCC
tech_stack:
  - Python
  - JSON
  - CSV
  - Excel
  - Pytorch
  - ResNet-18
  - BLIP
  - Image Embedding
  - FINCH
  - API
  - Prompt Engineering
links:
  - type: github
    url: https://github.com/inhyuk2000/A-Hierarchical-Interpretation-Framework-Based-on-Multi-Neuron-Activation-Patterns
    label: Code
  - type: paper
    url: https://drive.google.com/file/d/1uWJFUDAfLPXYbSUnXimOIX25oONO9hSv/view
    label: Paper
  - type: live
    url: https://drive.google.com/file/d/1aU-uae0jrcig558qPGx4nDtew1k7Hyrt/view
    label: Award
featured: true
status: "Done"
role: "논문 공동 저자"
duration: "4 months"
team_size: 3
highlights:
  - "Handles 10k+ concurrent users"
  - "99.9% uptime SLA"
  - "Processing $50k+ monthly transactions"
  - "60% faster page load vs competitors"
---

#### 📄 Paper

> **딥러닝 해석을 위한 계층적 다중 뉴런 프레임워크 모델 개발**

📑 [Research Paper (PDF)](https://drive.google.com/file/d/1uWJFUDAfLPXYbSUnXimOIX25oONO9hSv/view)

#### 🏆 Award

> **KCC 2025 Encouragement Award (장려상)**

🏅 [Award Certificate](https://drive.google.com/file/d/1aU-uae0jrcig558qPGx4nDtew1k7Hyrt/view)


<br/>

### 설명
- **프로젝트 이름**: 딥러닝 해석을 위한 계층적 다중 뉴런 프레임워크 모델 개발
- **프로젝트 기간**: 2025.03 ~ 2025.07
- **프로젝트 설명**: 사전 라벨이 없는 이미지 데이터를 의미 단위로 계층화하고, 각 이미지 그룹에 공통으로 반응하는 다중 뉴런을 추출해 딥러닝 모델의 내부 의미 구조를 자연어로 설명하는 자동 해석 프레임워크
- **프로젝트 목적**: 단일 뉴런 중심 해석 방식의 한계를 보완하고, 딥러닝 모델 내부에서 여러 뉴런이 함께 형성하는 복잡한 개념 구조를 계층적으로 분석
- **분석 모델**: ResNet-18
- **데이터 출처**: Unsplash Lite Dataset
- **분석 데이터**: 약 25,000장의 무라벨 고해상도 자연 이미지
- **주요 분석 대상**: 이미지 의미 계층, 공통 활성 뉴런 그룹, 상·하위 계층 간 차이 뉴런
- **프로젝트 성과**: KCC 2025 논문 발표 및 Encouragement Award 수상

<br/>

### 프로젝트를 진행하며 느낀점
여러 프로젝트를 진행하며 {{% high_mark %}}**직접 사용해보기 전에는 실제 문제를 발견하기 어렵다**{{% /high_mark %}}는 생각을 갖게 되었습니다. 이에 뉴런 해석과 관련된 기존 논문의 GitHub 코드를 직접 설치하고 실행해보며, 기존 방법의 한계와 개선이 필요한 지점을 파악하고자 했습니다.

이전 프로젝트에서 연구 기획을 여러 차례 수정했던 경험을 바탕으로, 이번 프로젝트에서는 문제를 정의하고 새로운 연구 방향을 구체화하는 과정에 특히 많은 노력을 기울였습니다. 이후 딥러닝 프로젝트 담당 교수님과 주기적으로 회의를 진행하며 연구 방향을 지속적으로 점검하고 수정했고, 그 과정에서 새로운 접근을 설계하기 위한 인사이트를 얻을 수 있었습니다.

**최종적으로 단일 뉴런을 중심으로 의미를 해석하는 기존 방식에서 벗어나, 여러 뉴런의 공통 활성화 패턴을 하나의 집합으로 구성해 해석에 활용하는 아이디어를 제안**했습니다. 이를 바탕으로 연구를 성공적으로 마무리하고 KCC 2025 학술대회에 논문을 제출했으며, 감사하게도 장려상을 수상했습니다. 직접 문제를 발견하고 연구 방향을 설계하기 위해 기울였던 노력이 성과로 이어졌다는 점에서 큰 보람을 느낄 수 있었습니다.
