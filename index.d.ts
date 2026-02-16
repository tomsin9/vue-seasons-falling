import { DefineComponent } from 'vue';

declare const SeasonsFalling: DefineComponent<{
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  theme?: 'light' | 'dark';
  amount?: number;
  wind?: number;
  mouseInteraction?: boolean;
  fullScreen?: boolean;
}, {}, any>;

export default SeasonsFalling;