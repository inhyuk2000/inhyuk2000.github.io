---
title: "NotiLLM_Analysis"
date: 2026-08-10
summary: "자연어 명령이 실제 알림 제어 결과로 어떻게 이어졌는지 검증하는 분석"
tags:
  - NotiLLM
  - Firebase
authors:
  - me
featured: true
---

> [!note] 지금 어떤 식으로 검증을 진행할 지, 그리고 필요하다면 추가적으로 JSON 필드를 수정해 결과를 정확히 검증할 수 있는 방법을 고민중입니다.

[Colab Link (수정중)](https://colab.research.google.com/drive/1xMbI-0sWAL4gFqEr_G8fU2_qvwUj8qV-?usp=sharing)

## 사용자 알림 규칙 설정 패턴 분석

> RQ1. 사용자들은 어떤 형태의 알림 제어 규칙을 주로 설정하는가?

* 분석 항목

  * `mute / allow` 사용 비율
  * 전체 알림 / 특정 앱 제어 비율
  * 앱별 규칙 설정 빈도
  * `contents` 조건 사용 빈도
  * `recurrence` 조건 사용 빈도
  * 규칙별 지속 시간 분포
  * 규칙 생성 시간대 분포
  * 단일 조건 / 복합 조건 사용 비율
* 분석 목적

  * 사용자가 실제로 어떤 방식으로 알림 제어 기능을 활용하는지 파악
  * 자주 사용되는 조건과 거의 사용되지 않는 조건을 확인
  * 실제 사용 패턴을 기반으로 핵심 기능 및 개선 우선순위 도출

## 규칙 복잡도와 실행 정확도

> H1. 알림 제어 규칙에 포함되는 조건이 많아질수록 Rule Execution Accuracy가 감소할 것이다.

* 독립변수: 규칙 복잡도

  * 앱만 지정
  * 앱 + 시간
  * 앱 + 키워드
  * 앱 + 시간 + 키워드
* 종속변수: `Rule Execution Accuracy`
* 분석 목적

  * 복합적인 규칙에서 시스템 오류가 증가하는지 확인
  * 어떤 조건 조합이 실제 실행 단계에서 취약한지 파악

## 앱 지정 여부와 알림 제어 정확도

> H2. 특정 앱을 지정한 알림 제어 규칙은 전체 알림을 대상으로 하는 규칙보다 Rule Execution Accuracy가 낮을 것이다.

* 독립변수: 규칙 대상

  * 전체 알림
  * 특정 앱
* 종속변수: `Rule Execution Accuracy`
* 분석 목적

  * 앱 이름 → `packageName` 매핑 과정이 성능 저하 요인인지 확인
  * 앱 매핑 로직의 개선 필요성 판단

## 알림 규칙 유형과 실행 정확도

> H3. `allow` 규칙과 `mute` 규칙 간 Rule Execution Accuracy에 차이가 있을 것이다.

* 독립변수: `mode`

  * `allow`
  * `mute`
* 종속변수: `Rule Execution Accuracy`
* 분석 목적

  * 알림 허용과 차단 로직 중 어느 쪽에서 오류가 많이 발생하는지 확인
  * 규칙 처리 로직의 구조적 차이에서 발생하는 문제 탐색