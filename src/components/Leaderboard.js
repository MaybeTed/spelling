import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Leaderboard extends React.Component {
  constructor() {
    super();
    this.state = {
      leaders: [],
      users: [],
      type: 'points',
      level: 'all'
    }
    this.changeLevel = this.changeLevel.bind(this);
    this.changeType = this.changeType.bind(this);
  }

  componentDidMount() {
    axios.get('/api/leaderboard')
      .then((response) => {
        this.setState({ leaders: response.data.leaders, users: response.data.users })
      });
  }

  changeLevel(e) {
    e.preventDefault();
    this.setState({ level: e.currentTarget.value }, () => this.sort());
  }

  changeType(e) {
    e.preventDefault();
    this.setState({ type: e.currentTarget.value }, () => this.sort());
  }

  sort() {
    let leaders = this.state.users.slice();
    if (this.state.level === 'all') {
      leaders = leaders.map((leader) => {
        if (this.state.type === 'points') {
          leader.points = leader.score['Easy'].points + leader.score['Medium'].points + leader.score['Hard'].points;
        } else {
          let correct = 0;
          if (leader.score['Easy'].correct) { correct += leader.score['Easy'].correct }
          if (leader.score['Medium'].correct) { correct += leader.score['Medium'].correct }
          if (leader.score['Hard'].correct) { correct += leader.score['Hard'].correct }
          let attempts = 0;
          if (leader.score['Easy'].attempts) { attempts += leader.score['Easy'].attempts }
          if (leader.score['Medium'].attempts) { attempts += leader.score['Medium'].attempts }
          if (leader.score['Hard'].attempts) { attempts += leader.score['Hard'].attempts }
          leader.points = Math.floor((correct / attempts) * 100);
          if (attempts === 0) { leader.points = 0 }
        }
        return leader;
      })
    } else {
      if (this.state.type === 'points') {
        leaders = leaders.map((leader) => {
          leader.points = leader.score[this.state.level].points;
          return leader;
        })
      } else {
        leaders = leaders.map((leader) => {
          leader.points = Math.floor((leader.score[this.state.level].correct / leader.score[this.state.level].attempts) * 100);
          if (leader.score[this.state.level].attempts === 0) {
            leader.points = 0;
          }
          return leader;
        })
      }
    }
    leaders = leaders.sort((a, b) => {
      if (a.points < b.points) {
        return 1;
      } else {
        return -1;
      }
    })
    this.setState({ leaders });
  }

  render() {
    return (
      <div className="leaderboard">
        <h1>Leaderboard</h1>
        <div className="sort-options">
          <p>Sort by 
            <span>
              <select onChange={this.changeType}>
                <option value="points">Points</option>
                <option value="percent">Percent</option>
              </select>
              <select onChange={this.changeLevel}>
                <option value="all">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </span>
          </p>
        </div>
        <table>
          <tbody>
            {this.state.leaders.map((leader, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}.</td>
                  <td><Link to={`/profile/${leader.username}`}>{leader.username}</Link></td>
                  <td className="leaderboard-table-points">{leader.points.toLocaleString()}{this.state.type === 'percent' && '%'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Leaderboard;
