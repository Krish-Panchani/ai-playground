import { useState } from 'react';

const useAge = () => {
    const ageGroups = [
        "Kid Artist (Age: 6 or below)",
        "Junior Artist (Age: 7y to 12y)",
        "Teen Artist (Age: 13y to 19y)",
        "Adult Artist (Age: 20y or above)",
    ];
    const [ageGroup, setAgeGroup] = useState(ageGroups[0]);

    return {
        ageGroup,
        setAgeGroup,
        ageGroups
    };
};

export default useAge;
