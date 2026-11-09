import {useCallback, useEffect, useRef, useState} from 'react';
import {Vibration} from 'react-native';

import {RIBBON_HOLD_MS, SHAPING} from '../constants/config';
import {isShapingRow, rowsUntilShaping} from '../game/gauge';

/**
 * Row counter with the shaping reminder ribbon.
 * Timers live in refs (rule 8) so callbacks never read stale state.
 */
export function useRowCounter(initial: number, onTotalChange?: (total: number) => void) {
  const [row, setRow] = useState(initial);
  const [ribbon, setRibbon] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalRef = useRef(onTotalChange);
  totalRef.current = onTotalChange;

  useEffect(() => {
    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };
  }, []);

  const showRibbon = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
    setRibbon(true);
    hideTimer.current = setTimeout(() => {
      setRibbon(false);
      hideTimer.current = null;
    }, RIBBON_HOLD_MS);
  }, []);

  const bump = useCallback(
    (delta: number) => {
      setRow(prev => {
        const next = Math.max(0, Math.min(999, prev + delta));
        if (next > prev) {
          Vibration.vibrate(12);
          if (totalRef.current) {
            totalRef.current(next - prev);
          }
          if (isShapingRow(next, SHAPING.everyRows)) {
            showRibbon();
          }
        }
        return next;
      });
    },
    [showRibbon],
  );

  const tap = useCallback(() => bump(1), [bump]);
  const undo = useCallback(() => bump(-1), [bump]);
  const addTen = useCallback(() => bump(10), [bump]);

  const reset = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setRibbon(false);
    setRow(0);
  }, []);

  return {
    row,
    ribbon,
    toShaping: rowsUntilShaping(row, SHAPING.everyRows),
    tap,
    undo,
    addTen,
    reset,
  };
}

export default useRowCounter;
