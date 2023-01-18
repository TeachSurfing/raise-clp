import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { ChapterDto, LearningPlanDto, UnitDto } from '@raise-clp/models';
import { Component } from 'react';
import { SelectedItem } from '../../app';

import './chapter-overview.scss';

export default class ChapterOverviewComponent extends Component<{
  learningPlan: LearningPlanDto | undefined;
  selected: ChapterDto | UnitDto | undefined;

  clickHandler: (selectedItem: SelectedItem) => void;
}> {
  state: { selected: ChapterDto | UnitDto | undefined; expanded: number } = {
    selected: this.props.selected,
    expanded: 0,
  };

  render() {
    if (
      this.props.learningPlan?.chapters &&
      this.props.learningPlan.chapters.length > 0
    )
      return (
        <>
          <h2>Chapter overview</h2>

          {this.props.learningPlan.chapters.map((chapter, index) => (
            <Accordion
              key={chapter.id}
              expanded={this.state.expanded === index}
              onClick={() => {
                if (this.state.expanded === index)
                  this.setState({ expanded: undefined });
                else this.setState({ expanded: index });
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {chapter.title}
              </AccordionSummary>
              <AccordionDetails>
                <ul className="units">
                  {chapter.units.map((unit) => (
                    <li
                      key={unit.id}
                      className={
                        unit.id === this.state.selected?.id ? 'active' : ''
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        this.setState({ selected: unit });
                        this.props.clickHandler({
                          chapterId: chapter.id,
                          unitId: unit.id,
                          rule: unit.rule,
                          selectedDto: unit,
                        });
                      }}
                    >
                      {unit.title}
                    </li>
                  ))}
                </ul>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      );

    return 'loading';
  }
}
