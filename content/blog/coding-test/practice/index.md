---
title: "Coding Test"
date: 2026-08-11
summary: "8월 12일 코딩테스트 공부 및 이론 정리"
tags:
  - Coding Test
  - Python
authors:
  - me
featured: true
---

{{% high_mark %}}**프로그래머스**{{% /high_mark %}}
[문제 링크](https://school.programmers.co.kr/learn/challenges?tab=algorithm_practice_kit)

>[!important] [Step1] 최소직사각형

### 분류
{{% high_mark %}}**그리디**{{% /high_mark %}}

### 접근 방법
Max(가로), Max(세로)로 생각했지만, 명함을 눕혀 사이즈를 조정할 수 있음.
그러면 모든 명함을 한 방향으로 통일해서 정렬하고, 그 안에서 제일 큰 가로와 세로 길이를 측정하면 한 번에 해결할 수 있음.

### 풀이 전략
각 명함의 방향을 정규화해서 한 번 순회하는 풀이이다.
{{% high_mark %}}**회전 가능한 데이터를 일정한 기준으로 정규화한 뒤 최댓값을 구한다.**{{% /high_mark %}}

### 관련 이론 정리
[하루코딩](https://www.youtube.com/watch?v=8V2zw6Qxarc)

---

>[!important] [Step2] 주차 요금 계산

### 분류
{{% high_mark %}}**구현**{{% /high_mark %}}

### 접근 방법 및 풀이 전략
차량별로 Dictionary 자료구조를 활용해서 입 • 출차 기록을 모으고, 각 차량의 누적 주차 시간을 계산하여 요금을 한 번만 계산한다.

### 내 코드
```python
import math

def solution(fees, records):
    def_min, def_pri, unit_min, unit_pri = fees
    car_dict = dict()

    answer = []

    for record in records:
        time, car_num, is_in_out = record.split()
        [hour, minute] = time.split(":")
        # 데이터 삽입
        if not car_num in car_dict.keys():
            car_dict[car_num] = [[int(hour), int(minute), is_in_out]]
        else:
            car_dict[car_num].append([int(hour), int(minute), is_in_out])
    for k, v in car_dict.items():
        if len(v) % 2 == 1: # 홀수개인 경우
            car_dict[k].append([23, 59, 'OUT'])

    car_sort_keys = sorted(car_dict.keys())

    print(car_dict)

    for car_sort_key in car_sort_keys:

        period_min = 0

        while len(car_dict[car_sort_key]) > 0:
            car_out = car_dict[car_sort_key].pop()
            car_in = car_dict[car_sort_key].pop()

            period_min += (car_out[0] * 60 + car_out[1]) - (car_in[0] * 60 + car_in[1])

        if period_min <= def_min:
            answer.append(def_pri)
        else:
            answer.append(def_pri + (math.ceil((period_min - def_min) / unit_min) * unit_pri)) 

    return answer
```

### 잘 작성된 Class 기반 코드
```python
from collections import defaultdict
from math import ceil

class Parking:
    def __init__(self, fees):
        self.fees = fees
        self.in_flag = False
        self.in_time = 0
        self.total = 0

    def update(self, t, inout):
        self.in_flag = True if inout=='IN' else False
        if self.in_flag:  self.in_time = str2int(t)
        else:             self.total  += (str2int(t)-self.in_time)

    def calc_fee(self):
        if self.in_flag: self.update('23:59', 'out')
        add_t = self.total - self.fees[0]
        return self.fees[1] + ceil(add_t/self.fees[2]) * self.fees[3] if add_t >= 0 else self.fees[1]

def str2int(string):
    return int(string[:2])*60 + int(string[3:])

def solution(fees, records):
    recordsDict = defaultdict(lambda:Parking(fees))
    for rcd in records:
        t, car, inout = rcd.split()
        recordsDict[car].update(t, inout)
    return [v.calc_fee() for k, v in sorted(recordsDict.items())]
```

### 알아두면 좋을 개념
`from collections import defaultdict`
: 파이썬의 일반 dict와 거의 같은데, {{% high_mark %}}**존재하지 않는 key에 접근했을 때 기본값을 자동으로 만들어주는 딕셔너리**{{% /high_mark %}}이다.
- {{% high_mark %}}**다음번에 Dictionary 자료구조를 이용해야 할 때, 한 번 활용**{{% /high_mark %}}해보자.

---

>[!important] [Step3] k진수에서 소수 개수 구하기

### 분류
{{% high_mark %}}**구현**{{% /high_mark %}}

### 접근 방법 및 풀이 전략
문제에서 요구하는 과정을 순서대로 구현하는 **구현 문제**로 접근하였다. 주어진 숫자를 `k진수`로 변환한 뒤, `0`을 기준으로 분리하고 각 숫자가 소수인지 판별하여 개수를 계산하였다.

#### 진법 변환
```python
def parseTen(el):
    index = 0
    parsed = 0
    for ch in el[::-1]:
        num = int(ch)
        parsed += num * (10 ** index)
        index += 1
    return parsed
```
- 문자열의 각 문자를 하나씩 뒤에서부터 카운팅하기 위해서는 `el[::-1]`을 활용해 역순으로 찾아야 한다.
- index는 몇 제곱인지를 나타내므로 `10 ** index`으로 나타내야 한다.

#### 소수 판별
```python
def isPrime(num):
    if num < 2:
        return False
    for idx in range(2, int(num ** 0.5) + 1):
        if num % idx == 0:
            return False
    return True
```
- 처음에는 소수의 개수를 세줄때, `range(2, int(num))` 으로 세어서 시간 초과가 발생하였다.
- 소수 판별 시에는, {{% high_mark %}}**[제곱근 + 1]**{{% /high_mark %}}개 만큼만 카운팅해주면 된다는 것을 기억하자.

---

>[!important] [해시] 완주하지 못한 선수

```python
from collections import defaultdict

def solution(participant, completion):
    
    part_dict = defaultdict(int)
    
    for part in participant:
        part_dict[part] += 1
    
    for comp in completion:
        part_dict[comp] -= 1
        if part_dict[comp] == 0:
            del part_dict[comp]
            
    answer = list(part_dict.keys())[0]
    
    return answer
```

### 접근 방법
`defaultdict`를 사용해 존재하지 않는 키에 접근할 경우, 자동 생성하도록 만들었다. 그 자동으로 생성할 때의 값을 뭘로 설정할 지를 `defaultdict`의 인자로 넣어준다.

### 풀이 전략
문제 자체는 어렵지 않으나, 통과하기 위해서는 최적화를 통해 시간 단축이 필요하다. 따라서 list 사용해 이중 순회하는 것이 아니라 Dictionary를 사용해 O(1)의 시간복잡도로 조회 및 수정이 이루어지도록 설계했다.

---

>[!important] [해시] 폰켓몬

### 접근 방법
ㅇㅇㅇ

### 풀이 전략
ㅇㅇㅇ

### 관련 이론 정리
ㅇㅇㅇ

---

>[!important] [해시] 전화번호 목록

### 접근 방법
ㅇㅇㅇ

### 풀이 전략
ㅇㅇㅇ

### 관련 이론 정리
ㅇㅇㅇ

---

>[!important] [해시] 의상

### 접근 방법
ㅇㅇㅇ

### 풀이 전략
ㅇㅇㅇ

### 관련 이론 정리
ㅇㅇㅇ

---

>[!important] [해시] 베스트앨범

### 접근 방법
ㅇㅇㅇ

### 풀이 전략
ㅇㅇㅇ

### 관련 이론 정리
ㅇㅇㅇ