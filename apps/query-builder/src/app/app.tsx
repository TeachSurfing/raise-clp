import { Component } from 'react';
import 'react-querybuilder/dist/query-builder.scss';
import './app.module.scss';
import ChapterOverviewComponent from './components/chapter-overview/chapter-overview';
import RuleBuilderComponent from './components/rule-builder/rule-builder';

export default class AppComponent extends Component {
  render() {
    return (
      <div className="wrapper">
        <div>
          <ChapterOverviewComponent />
        </div>
        <div>
          <RuleBuilderComponent />
        </div>
      </div>
    );
  }
}
