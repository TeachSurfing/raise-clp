import { INewLearningPlanPayload, LearningPlanDto } from '@raise-clp/models';
import { BaseLearningPlan } from '../model/base-learning-plan.model';

export const createLearningPlan = async ({
    name,
    description,
    courseUrl,
    questionnaireUrl,
    paperformToken
}: BaseLearningPlan) => {
    // TODO: change lpOptionalUrl depending on the environment
    const payload: INewLearningPlanPayload = {
        name,
        description,
        courseUrl,
        lpOptionalUrl:
            'https://demo-clp.teachsurfing.com/wp-json/learnpress-recommended-lessons/v1/add-multiple-optional-lessons',
        paperformToken,
        questionnaireUrl
    };
    const response = await fetch(`${(window as any).env.API_URL as string}/learning-plans`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    if (!response.ok) {
        throw response;
    }
    const lp: LearningPlanDto = await response.json();
    return lp;
};

export const fetchLearningPlans = async (): Promise<LearningPlanDto[]> => {
    const response = await fetch(`${(window as any).env.API_URL as string}/learning-plans`, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw response;
    }
    const learningPlans: LearningPlanDto[] = (await response.json()) || [];
    return learningPlans;
};

export const fetchLearningPlanById = async (id: string): Promise<LearningPlanDto> => {
    const response = await fetch(`${(window as any).env.API_URL as string}/learning-plans/${id}`, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw response;
    }
    const learningPlan: LearningPlanDto = (await response.json()) || [];
    return learningPlan;
};
