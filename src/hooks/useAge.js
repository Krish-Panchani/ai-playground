import { useState } from 'react';

const useAge = () => {
    const [ageGroup, setAgeGroup] = useState("Junior Artist (Age: 12 and below)");
    const ageGroups = [
        "Junior Artist (Age: 12 and below)",
        "Teen Artist (Age: between 13-19)",
        "Adult Artist (Age: 20 and above)"
    ];

    return {
        ageGroup,
        setAgeGroup,
        ageGroups
    };
};

export default useAge;
