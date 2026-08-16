---
title: "파이썬을 활용한 머신러닝 딥러닝 입문"
date: 2026-08-16
summary: "인프런 강의 및 정리"
tags:
  - ML
  - DL
authors:
  - me
featured: true
---

## 머신러닝 종류
- 지도 학습 : `Data의 정답을 이는 경우`
  - 분류 (Classification)
  - 회귀 (Regression)
- 비지도 학습 : `Data의 정답을 모르는 경우`
- 강화 학습 : 분류나 예측이 아닌 행동을 결정 `의사결정`
  - 지도 학습 : `Label(정답)`을 아는 경우
    - Model에 학습시켜 새로운 Data에 대한 Output 예측
  - 비지도 학습 : `Training Data`에 `Label(정답)`이 없음
    - Data의 패턴을 인식해 군집화 및 특징 추출 `사람이 결과 해석`

## 머신러닝에 사용되는 파이썬 라이브러리

### Scikit-Learn

- 전통적 ML Tools:
  - 벤치마크용 데이터셋 예제
  - 데이터 전처리 함수들
  - 지도 / 비지도 Model
  - 모형 평가 및 선택

## 딥러닝에 사용되는 파이썬 라이브러리

- `Scikit-Learn`, `Tensorflow`, `Keras` (Tensorflow에 대한 High-Level API. 더 쉽게 쓰기 위함), `Pytorch`

> [!Note] 작성 예정