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
  - type: pdf
    url: https://drive.google.com/file/d/1mD1rLgHoQKxrDjk7r2gVDSrkQbv82iAh/view?usp=sharing
    label: Poster
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

#### 🖼️ Poster

> **KCC 2025 Conference Poster**

📄 [Poster (PDF)](https://drive.google.com/file/d/1mD1rLgHoQKxrDjk7r2gVDSrkQbv82iAh/view?usp=sharing)

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

---

> [!question] `ResNet-18`이 이미지를 볼 때 내부의 여러 뉴런들이 어떤 개념을 함께 표현하고 있는지를 자동으로 찾아서 자연어로 설명해보자. 즉, 기존에는 주로 뉴런 하나씩 해석했다면, 우리는 **여러 뉴런을 그룹으로 묶고 그 관계를 계층적으로 해석**하려고 함.

## 문제 정의

<u>딥러닝의 블랙박스 문제</u>
- **단일 뉴런 기반** `XAI` 기존 연구 : [MILAN](https://arxiv.org/abs/2201.11114)
- 하나의 개념 표현에 여러 뉴런이 협력하기 때문에, 단일 뉴런 분석으로는 이런 **협동적 표현**을 고려하기 어려움

> 따라서 뉴런 하나씩 해석하지 말고, 같은 개념에 함께 반응하는 뉴런 그룹을 찾아서 해석하자.

### 그런데 어떤 이미지로 뉴런의 의미를 알아내지?
- 기존 연구들은 사람이 정한 라벨이 있는 데이터셋을 이용하는 경우가 많음.
  - 즉, **결국 사람이 미리 정한 개념 안에서만 모델을 분석하게 될 수 있는 문제가 있음.**
  - 이를 피하기 위해 아예 라벨이 없는 `Unsplash` 이미지 **25000장**을 사용함.

### 그럼 라벨이 없으면 비슷한 이미지를 어떻게 묶지?

`BLIP` : 이미지 **25000장**을 `BLIP`에 하나씩 넣어서 이미지 설명을 자동 생성함.

- ex. *이미지 A. 폭포 + 바위*
  - `BLIP`: *A waterfall located in a rocky environment.*
  - 이 `BLIP` 캡션을 이후 `의미 기반 클러스터링`의 **입력**으로 사용함.

### 비슷한 의미의 이미지들을 자동으로 묶음.

`FINCH` : 클러스터 개수를 사람이 미리 지정하지 않아도 되고, 반복적인 병합을 통해 계층적인 클러스터 구조 생성.

> [!note] 결과적으로 이미지들이 총 6개의 Level 계층 구조로 구성됨.

### ChatGPT를 활용해 한 클러스터의 모들 설명에 대한 대표 캡션을 생성함.

- ex. **클러스터 A.**
  - `A waterfall in a forest`
  - `A waterfall surrounded by rocks`
  - `A waterfall in a natural environment`

- `ChatGPT` 기반 **대표 캡션** 생성
  - `A waterfall located in a rocky environment.`


### 이미지들을 ResNet-18에 넣음.
- `Cluser A.` : `A waterfall located in a rocky environment.`
  - 이 클러스터 내 이미지 100장을 `ResNet-18`에 넣어서, 어떤 뉴런들이 **강하게 활성화**되는 지를 기록함.
  - 활성화 값이 전체 뉴런 중 `상위 10%`에 들어가는 뉴런 추출 = `활성화 뉴런` 정의

{{% high_mark %}}**공통 활성 뉴런 그룹 찾음.**{{% /high_mark %}}
- 클러스터의 **절반 이상의 이미지에서 공통적으로 활성화되는 뉴런**을 해당 클러스터의 **대표 뉴런 그룹으로 선정**함.

### 계층적 뉴런 해석
- ex. `Level 1.`
  - `숲속 폭포` - `[10, 32, 81, 100]`
  - `협곡 폭포` - `[10, 32, 81, 150]`
  - `바위 폭포` - `[10, 32, 81, 200]`

공통 뉴런은 `[10, 32, 81]` 이므로, 이를 **상위 Level의 뉴런 그룹**으로 해석

{{% high_mark %}}**차이 뉴런 정의**{{% /high_mark %}}
- `[100]`: `숲속` 의미.
- `[150]`: `협곡` 의미.
- `[200]`: `바위` 의미. 

> [!note] `ResNet-18` 내부의 뉴런들을 단일 뉴런이 아니라 `여러 뉴런이 함께 표현하는 의미` + `상하위 의미 관계`로 설명하는 프레임워크를 구현함.

---

### 프로젝트를 진행하며 느낀점
여러 프로젝트를 진행하며 {{% high_mark %}}**직접 사용해보기 전에는 실제 문제를 발견하기 어렵다**{{% /high_mark %}}는 생각을 갖게 되었습니다. 이에 뉴런 해석과 관련된 기존 논문의 GitHub 코드를 직접 설치하고 실행해보며, 기존 방법의 한계와 개선이 필요한 지점을 파악하고자 했습니다.

이전 프로젝트에서 연구 기획을 여러 차례 수정했던 경험을 바탕으로, 이번 프로젝트에서는 문제를 정의하고 새로운 연구 방향을 구체화하는 과정에 특히 많은 노력을 기울였습니다. 이후 딥러닝 프로젝트 담당 교수님과 주기적으로 회의를 진행하며 연구 방향을 지속적으로 점검하고 수정했고, 그 과정에서 새로운 접근을 설계하기 위한 인사이트를 얻을 수 있었습니다.

**최종적으로 단일 뉴런을 중심으로 의미를 해석하는 기존 방식에서 벗어나, 여러 뉴런의 공통 활성화 패턴을 하나의 집합으로 구성해 해석에 활용하는 아이디어를 제안**했습니다. 이를 바탕으로 연구를 성공적으로 마무리하고 KCC 2025 학술대회에 논문을 제출했으며, 감사하게도 장려상을 수상했습니다. 직접 문제를 발견하고 연구 방향을 설계하기 위해 기울였던 노력이 성과로 이어졌다는 점에서 큰 보람을 느낄 수 있었습니다.
