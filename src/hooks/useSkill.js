import { useState } from 'react';

const useSkill = () => {
    const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const [skillLevel, setSkillLevel] = useState(skillLevels[0]);

    return {
        skillLevel,
        setSkillLevel,
        skillLevels
    };
};

export default useSkill;
