from .models import DonorProfile
from typing import List

# Compatibility map
BLOOD_COMPATIBILITY = {
    "A+": ["A+", "AB+"],
    "A-": ["A+", "A-", "AB+", "AB-"],
    "B+": ["B+", "AB+"],
    "B-": ["B+", "B-", "AB+", "AB-"],
    "AB+": ["AB+"],
    "AB-": ["AB+", "AB-"],
    "O+": ["A+", "B+", "O+", "AB+"],
    "O-": ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
}

def find_matching_donors(donors: List[DonorProfile], requested_blood: str, city: str):
    matches = []
    for donor in donors:
        if donor.eligibility and donor.city.lower() == city.lower():
            if donor.blood_group in BLOOD_COMPATIBILITY and requested_blood in BLOOD_COMPATIBILITY[donor.blood_group]:
                matches.append(donor)
    return matches
