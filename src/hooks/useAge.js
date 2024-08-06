import { useState } from 'react';

const useAge = () => {
    const ageGroups = [
        "Junior Artist (Age: 12 and below)",
        "Teen Artist (Age: between 13-19)",
        "Adult Artist (Age: 20 and above)"
    ];
    const [ageGroup, setAgeGroup] = useState(ageGroups[0]);

    return {
        ageGroup,
        setAgeGroup,
        ageGroups
    };
};

export default useAge;
