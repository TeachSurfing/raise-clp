import { createTheme, ThemeProvider } from '@mui/material';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import { Component } from 'react';
import { formatQuery, QueryBuilder } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.scss';
import './rule-builder.scss';

const muiTheme = createTheme();

export default class RuleBuilderComponent extends Component {
  public readonly state = {
    rules: [
      {
        combinator: 'and',
        rules: []
      }
    ],
    fields: undefined
  };

  componentDidMount() {
    fetch('http://localhost:3000/clp-logic')
      .then(response => response.json())
      .then(console.log)
      .then(data => this.setState({ rules: data }));
  }

  addChapter() {
    this.setState({
      ...this.state,
      rules: [
        ...this.state.rules,
        {
          combinator: 'and',
          rules: []
        }
      ]
    });
  }

  render() {
    return (
      <section className='wrapper'>
        <h1>Build your Query</h1>
        {this.state.rules?.map((q, i) => {
          return (
            <QueryBuilderDnD>
              <ThemeProvider theme={muiTheme}>
                <QueryBuilderMaterial>
                  <QueryBuilder
                    fields={this.state.fields}
                    query={q}
                    onQueryChange={changed =>
                      this.setState(
                        this.state.rules.map((qc, index) =>
                          index === i ? changed : qc
                        )
                      )
                    }
                  />
                </QueryBuilderMaterial>
              </ThemeProvider>
            </QueryBuilderDnD>
          );
        })}

        <button onClick={this.addChapter}>Add Chapter</button>

        <h4>
          JSON logic as result of <code>formatQuery(query, 'jsonlogic')</code>:
        </h4>

        <pre>
          {this.state.rules?.map(q =>
            JSON.stringify(formatQuery(q, 'jsonlogic'))
          )}
        </pre>
      </section>
    );
  }
}
