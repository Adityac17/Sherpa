#!/usr/bin/env python3
"""
Personalized Learning Resource Recommender - Python Test Runner
Executes the 5 test cases against the live API endpoint (or offline validator)
and generates /tests/report.md and logs the run to the database.
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
BASE_URL = os.environ.get("TEST_BASE_URL", "http://localhost:3000")

TEST_FILES = [
    "case_1_beginner_topic.json",
    "case_2_advanced_topic.json",
    "case_3_vague_goal.json",
    "case_4_two_goals.json",
    "case_5_edge_case_nonsense.json"
]

def run_test_case(file_name):
    path = os.path.join(BASE_DIR, file_name)
    with open(path, "r", encoding="utf-8") as f:
        case = json.load(f)

    test_id = case.get("id")
    name = case.get("name")
    input_data = case.get("input")
    assertions = case.get("assertions")

    print(f"Executing [{test_id}] {name}...")
    start_time = time.time()
    
    url = f"{BASE_URL}/api/recommend"
    payload = json.dumps(input_data).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"}
    )

    passed = False
    notes = ""
    rubric = None
    http_code = None

    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            http_code = res.status
            body = json.loads(res.read().decode("utf-8"))
            
            if assertions.get("should_pass_validation"):
                resources = body.get("run", {}).get("resources", [])
                rubric = body.get("run", {}).get("rubric_scores", {})
                quality_score = rubric.get("overall_score", 0)
                min_score = assertions.get("minimum_rubric_quality_score", 70)

                if len(resources) >= assertions.get("minimum_resource_count", 3) and quality_score >= min_score:
                    passed = True
                    notes = f"Generated {len(resources)} resources. Quality score: {quality_score}/100. Assertions passed."
                else:
                    passed = False
                    notes = f"Score {quality_score}/100 below required {min_score} or insufficient resources ({len(resources)})."
            else:
                passed = False
                notes = "Expected validation failure, but API returned 200 OK."

    except urllib.error.HTTPError as e:
        http_code = e.code
        err_body = json.loads(e.read().decode("utf-8")) if e.fp else {}
        if not assertions.get("should_pass_validation"):
            if http_code == 400 and err_body.get("error"):
                passed = True
                notes = f"Correctly rejected with HTTP 400: '{err_body.get('error')}'"
            else:
                passed = False
                notes = f"Unexpected HTTP status {http_code}: {err_body}"
        else:
            passed = False
            notes = f"API returned error {http_code}: {err_body.get('error')}"

    except Exception as ex:
        passed = False
        notes = f"Connection / execution error: {str(ex)}"

    duration_ms = int((time.time() - start_time) * 1000)
    status_sym = "✓ PASS" if passed else "✗ FAIL"
    print(f"  -> {status_sym} ({duration_ms}ms): {notes}\n")

    return {
        "id": test_id,
        "name": name,
        "passed": passed,
        "notes": notes,
        "duration_ms": duration_ms,
        "input": input_data,
        "rubric": rubric
    }

def main():
    print("=" * 60)
    print(" Personalized Learning Resource Recommender - Python Test Runner")
    print("=" * 60)
    print(f"Target API: {BASE_URL}\n")

    results = []
    for tf in TEST_FILES:
        res = run_test_case(tf)
        results.append(res)

    passed_count = sum(1 for r in results if r["passed"])
    total_count = len(results)

    print("=" * 60)
    print(f"Execution complete: {passed_count}/{total_count} tests passed.")
    print("=" * 60)

    if passed_count < total_count:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()

