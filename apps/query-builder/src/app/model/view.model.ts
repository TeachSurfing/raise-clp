import { ChapterDto, UnitDto } from '@raise-clp/models';
import { JsonLogicRulesLogic } from 'react-querybuilder';

export interface SelectedItem {
    chapterId: number;
    unitId?: number;
    selectedDto: ChapterDto | UnitDto | undefined;
    rule: JsonLogicRulesLogic;
}
