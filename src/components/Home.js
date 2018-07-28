import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';
import Actions from '../actions/index';
import Message from './Message';
import Words from '../words';

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      level: 'Easy',
      easyWords: Words.easy,
      mediumWords: Words.medium,
      hardWords: Words.hard,
      currentWord: { definition: '' },
      response: 'none',
      score: 0
    }
    this.checkAnswer = this.checkAnswer.bind(this);
    this.changeLevel = this.changeLevel.bind(this);
    this.speak = this.speak.bind(this);
  }

  componentDidMount() {
    this.getScore();
  }

  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      this.getScore();
    }, 1000);
  }

  changeLevel(e) {
    e.preventDefault();
    const level = e.currentTarget.textContent;
    this.setState({ level }, () => this.getWord());
  }

  checkAnswer(e) {
    e.preventDefault();
    const userAnswer = document.getElementById('userAnswer').value;
    const correctAnswer = this.state.currentWord.word;
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      this.setState({ response: 'correct', currentWord: { definition: '' } });
      this.save(true, correctAnswer);
    } else {
      this.setState({ response: 'incorrect', currentWord: { definition: '' } });
      this.save(false, correctAnswer);
    }
    document.getElementById('userAnswer').value = '';
  }

  getScore(score = this.props.auth.user.score) {
    this.setState({
      score: score.Easy.points + score.Medium.points + score.Hard.points,
      response: 'none'
    }, () => setTimeout(() => {this.getWord()}, 1000));
  }

  getWord() {
    let words = this.state.easyWords;
    if (this.state.level === 'Medium') {
      words = this.state.mediumWords;
    } else if (this.state.level === 'Hard') {
      words = this.state.hardWords;
    }

    let randomIndex = Math.floor(Math.random() * words.length);
    this.setState({ currentWord: words[randomIndex] }, () => this.speak());
  }

  save(correct, word) {
      axios.post('/api/answer', {
        user: this.props.auth.user,
        correct,
        level: this.state.level,
        word
      }).then((response) => {
        Actions.fetchUser();
      })
  }

  speak() {
    var msg = new SpeechSynthesisUtterance(this.state.currentWord.word);
    window.speechSynthesis.speak(msg);
  }

  render() {
    return (
      <div>
        <div className="score-container">
          <p>Score: <span>{this.state.score}</span></p>
        </div>
        <div className="choose-level">
          <h2>What difficulty do you want to try?</h2>
          <div className="level-buttons">
            <button onClick={this.changeLevel}>Easy</button>
            <button onClick={this.changeLevel}>Medium</button>
            <button onClick={this.changeLevel}>Hard</button>
          </div>
        </div>
        <button className="say-it-again" onClick={this.speak}>Say it again</button>
        <form className="user-answer-form" onSubmit={this.checkAnswer}>
          <input type="text" id="userAnswer" />
          <button type="submit">Submit</button>
        </form>
        {this.state.response === 'none' ?
          <div className="definition">
            <h4>Definition:</h4>
            <h4>{this.state.currentWord.definition}</h4>
          </div>
          :
          <Message answer={this.state.response} />
        }
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Home));
