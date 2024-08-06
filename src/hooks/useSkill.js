import { useState } from 'react';

const useSkill = () => {
    const [skillLevel, setSkillLevel] = useState("Beginner");
    const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

    return {
        skillLevel,
        setSkillLevel,
        skillLevels
    };
};

export default useSkill;
