import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader
} from '@mui/material';
import { Component } from 'react';
import { LearningPlan } from '../../models/learning-plan.model';
import './chapter-overview.scss';

interface IChapterOverviewState {
  chapters: LearningPlan[] | undefined;
  open: { chapterId: number; open: boolean }[] | undefined;
}

export default class ChapterOverviewComponent extends Component {
  state: IChapterOverviewState = {
    chapters: undefined,
    open: undefined
  };

  componentDidMount() {
    fetch('http://localhost:3000/course-data')
      .then(response => response.json())
      .then((data: LearningPlan[]) => {
        const open = data.map(d => ({ chapterId: d.id, open: false }));
        this.setState({ chapters: data, open: open });
      });
  }

  handleClick(chapterId: number) {
    const open = this.state.open?.map(o => {
      if (o.chapterId === chapterId)
        return { chapterId: o.chapterId, open: !o.open };
      else return o;
    });
    this.setState({ open });
  }

  render() {
    if (this.state.chapters && this.state.chapters.length > 0)
      return (
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component='nav'
          aria-labelledby='nested-list-subheader'
          subheader={
            <ListSubheader component='div' id='nested-list-subheader'>
              Nested List Items
            </ListSubheader>
          }
        >
          {this.state.chapters.map(chapter => (
            <>
              <ListItemButton onClick={() => this.handleClick(chapter.id)}>
                <ListItemText primary={chapter.title} />
                {this.state.open?.find(d => d.chapterId === chapter.id)
                  ?.open ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItemButton>

              <Collapse
                in={
                  this.state.open?.find(d => d.chapterId === chapter.id)?.open
                }
                timeout='auto'
                unmountOnExit
              >
                <List component='div' disablePadding>
                  {chapter.items.map(i => (
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary={i.title} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </>
          ))}
        </List>
      );

    return 'loading';
  }
}

// <ul>
//   {this.state.chapters.map(chapter => (
//     <>
//       <li>{chapter.title}</li>
//       <ul>
//         {chapter.items.map(item => (
//           <li>{item.title}</li>
//         ))}
//       </ul>
//     </>
//   ))}
// </ul>;
