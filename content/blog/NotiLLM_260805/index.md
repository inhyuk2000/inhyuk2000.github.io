---
title: "NotiLLM_Crashlytics"
date: 2026-08-05
summary: "Crashlytics 추가를 통한 서비스 에러 모니터링 시스템 구축"
tags:
  - NotiLLM
  - Firebase
authors:
  - me
featured: true
---

## Firebase Crashlytics 연동

### 목적
앱이 강제 종료되거나 예외가 발생했을 때, 사용자가 로그를 보내지 않아도 Firebase Console에서 비정상 종료 보고서를 확인할 수 있도록 했다.

### 사전 조건
| 항목 | 최소 요구 | 본 프로젝트 |
|------|-----------|-------------|
| Gradle | 8.0 | 8.13 |
| Android Gradle Plugin | 8.1.0 | 8.11.1 |
| Google services 플러그인 | 4.4.1 | 4.4.2 |
| `app/google-services.json` | 필요 | 사용 중 |

### 코드 변경 요약
#### 1. 프로젝트 수준 (`build.gradle.kts`)
- Crashlytics Gradle 플러그인 추가  
  `id("com.google.firebase.crashlytics") version "3.0.3" apply false`

#### 2. 앱 모듈 (`app/build.gradle.kts`)
- `google-services.json`이 있을 때 플러그인 적용  
  - `com.google.gms.google-services`  
  - `com.google.firebase.crashlytics`
- Firebase 의존성 추가 (BoM 사용, 버전 미지정)
  - `firebase-crashlytics`
  - `firebase-analytics` (탐색경로 로그용)

#### 3. 테스트 비정상 종료 UI
- 위치: 프로필 화면 (`ProfileScreen`)
- debug 빌드에서만 **Test Crash** 버튼 표시
- 동작: `throw RuntimeException("Test Crash")`

### 검증 절차
1. Firebase Console → **Crashlytics** 사용 설정
2. (권장) 프로젝트 설정 → 통합에서 **Google Analytics** 사용 설정
3. 앱 빌드 후 설치·실행
4. **프로필** → **Test Crash** 탭 → 앱 강제 종료
5. 앱을 **다시 실행** (이때 보고서 전송)
6. Firebase Console → Crashlytics에서 `Test Crash` 확인  
   - 반영까지 수 분 소요될 수 있음

### 참고
- Test Crash 버튼은 `BuildConfig.DEBUG`일 때만 보이므로 release에는 노출되지 않음
- 확인 완료 후 테스트 버튼 코드는 제거해도 됨
- Crashlytics는 크래시/ANR 등 **비정상 종료**용이며, LLM 실패·규칙 생성 실패 등 **비즈니스 로그**는 Realtime Database 원격 로그로 별도 설계 필요

### 느낀점
- 가까운 지인에게 테스트를 부탁하면서 연령층 별로 생각보다 입력하는 메시지의 느낌이 다르다는 것을 느꼈다. "받지마/받아줘" 보다는 "보류"라는 단어를 사용하는 케이스가 있었다. 또한 "카카오톡 메시지"라는 말을 "카카오톡" 앱의 "메시지" 키워드로 잘못 등록하는 케이스도 존재했다. 해당 케이스에 대해서는 어떻게 컨트롤하고 제어 조건으로 설정하기 위해 프롬프팅해줘야 할 지 고민이 필요해 보였다.