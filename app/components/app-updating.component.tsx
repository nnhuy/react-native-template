import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {EVENT, Z_INDEX} from '../constants';
import {eventEmitter} from '../contexts';

export class AppUpdatingComponent extends Component {
  state = {
    percent: 0,
  };

  componentDidMount() {
    eventEmitter.on(
      EVENT.application.updating_progress,
      ({percent}: {percent: number}) => {
        this.setState({percent});
      },
    );
  }

  render() {
    return (
      <View style={[styles.updating]}>
        <Text style={styles.title}>
          There are new packages! The app is updating...
        </Text>
        {/* <LinearProgress
          color="primary"
          value={this.state.percent / 100}
          variant="determinate"
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  updating: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    zIndex: Z_INDEX.appUpdating,
    padding: 20,
  },
  title: {
    marginBottom: 40,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
