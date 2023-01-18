import { ChapterDto, LearningPlanDto, UnitDto } from '@raise-clp/models';
import { Component } from 'react';
import { SelectedItem } from '../../app';

import './chapter-overview.scss';

export default class ChapterOverviewComponent extends Component<{
  learningPlan: LearningPlanDto | undefined;
  selected: ChapterDto | UnitDto | undefined;
  clickHandler: (selectedItem: SelectedItem) => void;
}> {
  state: { selected: ChapterDto | UnitDto | undefined } = {
    selected: this.props.selected,
  };

  render() {
    if (
      this.props.learningPlan?.chapters &&
      this.props.learningPlan.chapters.length > 0
    )
      return (
        <>
          <h2>Chapter overview</h2>
          <ul className="chapters">
            {this.props.learningPlan.chapters.map((chapter) => (
              <li
                key={chapter.id}
                className={
                  chapter.id === this.state.selected?.id ? 'active' : ''
                }
              >
                {chapter.title}

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
              </li>
            ))}
          </ul>
        </>
      );

    return 'loading';
  }
}
