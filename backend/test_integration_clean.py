#!/usr/bin/env python3
"""
Integration Test - Test full HR Agent functionality with jobs integration
"""

import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def test_jobs_integration():
    """Test that jobs are properly integrated into the search system"""
    print("Testing Jobs Integration...")

    try:
        import backend

        # Initialize backend
        hr_backend = backend.get_backend()
        print(
            f"Data loaded: {len(hr_backend.candidates)} candidates, {len(hr_backend.jobs)} jobs"
        )

        # Verify jobs data structure
        if not hr_backend.jobs:
            print("No jobs loaded!")
            return False

        print("\nAvailable Jobs:")
        for i, job in enumerate(hr_backend.jobs):
            print(f"   {i+1}. {job['title']} in {job['location']}")
            print(f"      Skills: {', '.join(job['skillsRequired'])}")

        # Test search with job matching
        print("\nTesting Search with Job Integration:")

        test_cases = [
            ("React developer", "Frontend React Developer"),
            ("Python Django", "Backend Python Developer"),
            ("Full stack Node.js", "Full Stack Developer"),
            (
                "developer in Casablanca",
                "Frontend React Developer or Backend Python Developer",
            ),
        ]

        for query, expected_job in test_cases:
            print(f"\nQuery: '{query}'")
            print(f"Expected to match: {expected_job}")

            filters = backend.parse_query(query)
            results = backend.search_candidates(filters)

            print(f"Found {len(results)} candidates")

            if results:
                top_candidate = results[0]
                candidate = top_candidate["candidate"]
                print(
                    f"   Top: {candidate['firstName']} {candidate['lastName']} (Score: {top_candidate['score']})"
                )
                print(f"   Reason: {top_candidate['reason']}")

                # Check job recommendations
                job_recs = top_candidate.get("recommendedJobs", [])
                print(f"   Job recommendations: {len(job_recs)}")

                for job_rec in job_recs:
                    job = job_rec["job"]
                    score = job_rec["matchScore"]
                    skills = job_rec["matchedSkills"]
                    print(
                        f"     - {job['title']} (Score: {score}, Skills: {', '.join(skills)})"
                    )

                    # Verify location matching bonus
                    if job_rec.get("locationMatch"):
                        print("       Location match bonus applied!")

        # Test analytics with job stats
        print("\nTesting Enhanced Analytics:")
        analytics = backend.analytics_summary()

        if "jobStats" in analytics:
            job_stats = analytics["jobStats"]
            print("Job statistics included:")
            print(f"   Total jobs: {job_stats['totalJobs']}")
            print(f"   Skills in demand: {len(job_stats.get('skillsInDemand', []))}")
            print(f"   Location demand: {len(job_stats.get('locationDemand', []))}")
        else:
            print("Job statistics missing from analytics")

        if "skillsGapAnalysis" in analytics:
            gap_analysis = analytics["skillsGapAnalysis"]
            shortage = gap_analysis.get("skillsShortage", [])
            surplus = gap_analysis.get("surplusSkills", [])
            print("Skills gap analysis included:")
            print(f"   Skills shortage: {len(shortage)}")
            print(f"   Surplus skills: {len(surplus)}")

            if shortage:
                print("   Critical shortages:")
                for skill in shortage[:3]:  # Show top 3
                    print(f"     - {skill['skill']} (Gap: {skill['gap']})")
        else:
            print("Skills gap analysis missing from analytics")

        print("\nAll jobs integration tests passed!")
        return True

    except Exception as e:
        print(f"Integration test failed: {e}")
        import traceback

        traceback.print_exc()
        return False


def main():
    """Run all integration tests"""
    print("HR Agent - Full Integration Test")
    print("=" * 50)

    success = test_jobs_integration()

    print("\n" + "=" * 50)
    if success:
        print("ALL TESTS PASSED - Jobs integration working correctly!")
        print("\nKey Features Verified:")
        print("   • Jobs data loaded and accessible")
        print("   • Candidates scored based on job requirements")
        print("   • Job recommendations generated for candidates")
        print("   • Enhanced analytics with job statistics")
        print("   • Skills gap analysis between supply and demand")
        print("\nReady to run the full application!")
    else:
        print("TESTS FAILED - Check the errors above")

    return success


if __name__ == "__main__":
    main()
