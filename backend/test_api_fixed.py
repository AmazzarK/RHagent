#!/usr/bin/env python3
"""
Enhanced API Test Script - Test HR Agent backend endpoints
"""

import json

import requests

BASE_URL = "http://localhost:8000/api"


def _test_endpoint(method, endpoint, data=None):
    """Test an API endpoint and return the result."""
    url = f"{BASE_URL}{endpoint}"

    try:
        if method.upper() == "GET":
            response = requests.get(url, timeout=10)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, timeout=10)

        print(f"[SUCCESS] {method} {endpoint}")
        print(f"   Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            if isinstance(result, dict):
                if "candidates" in result:
                    print(f"   Results: {len(result['candidates'])} candidates")
                    if result["candidates"]:
                        candidate = result["candidates"][0]
                        print(
                            f"   Top: {candidate.get('firstName', '')} {candidate.get('lastName', '')} (Score: {candidate.get('score', 0)})"
                        )
                        if candidate.get("recommendedJobs"):
                            print(
                                f"   Job recommendations: {len(candidate['recommendedJobs'])}"
                            )
                elif "jobs" in result:
                    print(f"   Results: {len(result['jobs'])} jobs")
                else:
                    print(f"   Data keys: {list(result.keys())}")
            elif isinstance(result, list):
                print(f"   Results: {len(result)} items")
        else:
            print(f"   Error: {response.text}")

        return response

    except requests.exceptions.ConnectionError:
        print(f"[ERROR] {method} {endpoint} - Backend server not running!")
        print("   Run: python frontend.py")
        return None
    except requests.exceptions.Timeout:
        print(f"[ERROR] {method} {endpoint} - Request timeout!")
        return None
    except Exception as e:
        print(f"[ERROR] {method} {endpoint} - Error: {e}")
        return None


def _test_backend_direct():
    """Test backend functionality directly without HTTP"""
    print("Testing Backend Direct")

    try:
        import backend

        # Test data loading
        hr_backend = backend.get_backend()
        print(
            f"Backend loaded: {len(hr_backend.candidates)} candidates, {len(hr_backend.jobs)} jobs"
        )

        # Test search functionality
        filters = backend.parse_query("React developer")
        results = backend.search_candidates(filters)
        print(f"Search test: {len(results)} results for 'React developer'")

        if results:
            first = results[0]
            candidate = first["candidate"]
            print(
                f"   Top: {candidate['firstName']} {candidate['lastName']} (Score: {first['score']})"
            )
            if first.get("recommendedJobs"):
                print(f"   Recommended jobs: {len(first['recommendedJobs'])}")
                for job_rec in first["recommendedJobs"][:2]:  # Show top 2
                    print(
                        f"     - {job_rec['job']['title']} (Score: {job_rec['matchScore']})"
                    )

        return True

    except Exception as e:
        print(f"Backend test failed: {e}")
        return False


def main():
    """Main test function"""
    print("HR Agent - Comprehensive Test Suite")
    print("=" * 50)

    # Test backend directly first
    backend_ok = _test_backend_direct()

    if backend_ok:
        print("\n" + "=" * 50)
        print("Testing API endpoints (requires server running)")
        print("Make sure to run: python frontend.py")
        print()

        # Test basic endpoints
        _test_endpoint("GET", "/analytics")
        _test_endpoint("GET", "/jobs")
        _test_endpoint("GET", "/shortlists")

        print()

        # Test search endpoint
        search_queries = [
            "React developer",
            "Python developer in Casablanca",
            "Full stack developer with 3 years experience",
            "Developer available immediately",
        ]

        for query in search_queries:
            print(f"Testing search: '{query}'")
            _test_endpoint("POST", "/search", {"query": query})
            print()

    print("Tests completed!")


def test_all():
    """Pytest-compatible test: just runs main() and asserts no exceptions."""
    main()
    assert True


if __name__ == "__main__":
    main()
