import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Actions from '../actions/index';
import Chart from './Chart';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    profile: state.profile
  }
}

class Profile extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    Actions.populateProfile(this.props.match.params.user);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.user === this.props.profile.username) {
      return;
    }
    Actions.populateProfile(nextProps.match.params.user);
  }

  getAccuracy(level) {
    const { score } = this.props.profile;
    if (score[level].attempts === 0) {
      return 0;
    }
    return Math.floor((score[level].correct / score[level].attempts) * 100);
  }

  render() {
    if (this.props.profile && !this.props.profile.score) {
      return null;
    }

    return (
      <div className="profile">
        <header>
          <h4>{this.props.profile.username}</h4>
          <h4>Easy: {this.getAccuracy('Easy')}%</h4>
          <h4>Medium: {this.getAccuracy('Medium')}%</h4>
          <h4>Hard: {this.getAccuracy('Hard')}%</h4>
        </header>
        <section className="charts-container">
          <div className="column">
            <div className="key">
              <p><span className="green-key">abc</span> = Correct</p>
              <p><span className="red-key">abc</span> = Wrong</p>
            </div>
          </div>
          <Chart level="easy" scores={this.props.profile.score.Easy} />
          <Chart level="medium" scores={this.props.profile.score.Medium} />
          <Chart level="hard" scores={this.props.profile.score.Hard} />
        </section>
        <section className="charts-container">
          <div className="column"></div>
          <div className="column">
            <p>Correct: {this.props.profile.score.Easy.correct}</p>
            <p>Attempts: {this.props.profile.score.Easy.attempts}</p>
          </div>
          <div className="column">
            <p>Correct: {this.props.profile.score.Medium.correct}</p>
            <p>Attempts: {this.props.profile.score.Medium.attempts}</p>
          </div>
          <div className="column">
            <p>Correct: {this.props.profile.score.Hard.correct}</p>
            <p>Attempts: {this.props.profile.score.Hard.attempts}</p>
          </div>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Profile);
