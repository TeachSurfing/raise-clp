import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { ChapterDto, LearningPlanDto, UnitDto } from '@raise-clp/models';
import { useState } from 'react';
import { SelectedItem } from '../../model/view.model';
import './ChapterOverview.scss';

type Props = {
    selected: ChapterDto | UnitDto | undefined;
    learningPlan: LearningPlanDto;
    clickHandler: (selectedItem: SelectedItem) => void;
};

const ChapterOverview = (props: Props) => {
    const [selected, setSelected] = useState<ChapterDto | UnitDto | undefined>(props.selected);
    const [expanded, setExpanded] = useState<number | undefined>(0);
    const handleUnitClick = (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        chapter: ChapterDto,
        unit: UnitDto,
        props: Props
    ) => {
        e.stopPropagation();
        setSelected(unit);
        props.clickHandler({
            chapterId: chapter.id,
            unitId: unit.id,
            rule: unit.rule,
            selectedDto: unit
        });
    };

    return props.learningPlan?.chapters && props.learningPlan.chapters.length > 0 ? (
        <>
            <h2>Chapter overview</h2>

            {props.learningPlan.chapters.map((chapter: ChapterDto, index: number) => (
                <Accordion
                    key={chapter.id}
                    expanded={expanded === index}
                    onClick={() => {
                        setExpanded(expanded === index ? undefined : index);
                    }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>{chapter.title}</AccordionSummary>
                    <AccordionDetails>
                        <ul className="units">
                            {chapter.units.map((unit) => (
                                <li
                                    key={unit.id}
                                    className={unit.id === selected?.id ? 'active' : ''}
                                    onClick={(e) => handleUnitClick(e, chapter, unit, props)}
                                >
                                    {unit.title}
                                </li>
                            ))}
                        </ul>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    ) : (
        <span>loading</span>
    );
};

export default ChapterOverview;
