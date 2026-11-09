/**
 * StitchSwatchGauge - state machine only. No navigation library, no gameplay here.
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, View} from 'react-native';

import GameScreen from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import RescaleSheetScreen from './src/screens/RescaleSheetScreen';
import RowCounterScreen from './src/screens/RowCounterScreen';
import theme from './src/constants/theme';
import useSwatch from './src/hooks/useSwatch';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'counter';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [counterReturnTo, setCounterReturnTo] = useState<Screen>('menu');
  const [rowsLogged, setRowsLogged] = useState(0);
  const [counterRow, setCounterRow] = useState(0);

  const swatch = useSwatch();
  const screenRef = useRef(screen);
  screenRef.current = screen;
  const returnRef = useRef(counterReturnTo);
  returnRef.current = counterReturnTo;

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goGame = useCallback(() => setScreen('game'), []);
  const goGameOver = useCallback(() => setScreen('gameover'), []);

  const openCounter = useCallback((from: Screen) => {
    setCounterReturnTo(from);
    setScreen('counter');
  }, []);

  const closeCounter = useCallback(() => {
    setScreen(returnRef.current);
  }, []);

  const logRows = useCallback((delta: number) => {
    setRowsLogged(prev => Math.max(0, prev + delta));
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = screenRef.current;
      if (current === 'loader') {
        return true;
      }
      if (current === 'game' || current === 'gameover') {
        setScreen('menu');
        return true;
      }
      if (current === 'counter') {
        setScreen(returnRef.current);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={screen === 'loader' ? 'light-content' : 'dark-content'}
      />

      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          projectIndex={swatch.projectIndex}
          onProject={swatch.setProjectIndex}
          userStPer10={swatch.gauge.stPer10}
          patternStPer10={swatch.patternStPer10}
          diffPct={swatch.diffPct}
          rowsLogged={rowsLogged}
          onStart={goGame}
          onCounter={() => openCounter('menu')}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          stitches={swatch.stitches}
          rows={swatch.rows}
          sizeIndex={swatch.sizeIndex}
          sizeCm={swatch.sizeCm}
          userStPer10={swatch.gauge.stPer10}
          patternStPer10={swatch.patternStPer10}
          diffPct={swatch.diffPct}
          band={swatch.band}
          onStitches={swatch.setStitches}
          onRows={swatch.setRows}
          onSize={swatch.setSizeIndex}
          onBack={goMenu}
          onRescale={goGameOver}
        />
      ) : null}

      {screen === 'gameover' ? (
        <RescaleSheetScreen
          result={swatch.result}
          shaping={swatch.shaping}
          yarn={swatch.yarn}
          projectLabel={swatch.project.label}
          onAgain={goGame}
          onCounter={() => openCounter('gameover')}
          onMenu={goMenu}
        />
      ) : null}

      {screen === 'counter' ? (
        <RowCounterScreen
          initialRow={counterRow}
          targetRows={swatch.result.newRows}
          onBack={closeCounter}
          onLogged={logRows}
          onRowChange={setCounterRow}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});

export default App;
