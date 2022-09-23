import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  state = { jokes: [] };

  /* get jokes if there are no jokes */

  async componentDidMount() {
    this.getJokes();
  }

  async componentDidUpdate() {
    if (!this.state.jokes) this.getJokes();
  }

  async getJokes() {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j });
    } catch (e) {
      console.log(e);
    }
  }

  /* empty joke list and then call getJokes */

  generateNewJokes = () => {
    this.setState({ jokes: [] });
  };

  /* change vote for this id by delta (+1 or -1) */

  vote = (id, delta) => {
    const jokes = this.state.jokes.map((j) =>
      j.id === id ? { ...j, votes: j.votes + delta } : j
    );
    this.setState({ jokes: jokes });
  };

  /* render: either loading spinner or list of sorted jokes. */

  sortedJokes = () =>
    this.state.jokes
      ? [...this.state.jokes].sort((a, b) => b.votes - a.votes)
      : null;

  render() {
    if (this.state.jokes) {
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {this.sortedJokes().map((j) => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              vote={this.vote}
            />
          ))}
        </div>
      );
    }

    return null;
  }
}

export default JokeList;
