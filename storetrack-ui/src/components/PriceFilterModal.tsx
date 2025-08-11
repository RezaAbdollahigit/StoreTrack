import { useState } from 'react';
import ReactSlider from 'react-slider';

interface PriceFilterModalProps {
  onApply: (range: { min: number; max: number }) => void;
  onClose: () => void;
}

export default function PriceFilterModal({ onApply, onClose }: PriceFilterModalProps) {
  const [priceValues, setPriceValues] = useState([0, 5000]);

  const handleApplyClick = () => {
    onApply({ min: priceValues[0], max: priceValues[1] });
    onClose();
  };

  return (
    <div className="flex flex-col space-y-4 px-2">
      <div className="py-4">
        <ReactSlider
          className="w-full h-5 mt-4 mb-2 relative"
          defaultValue={[0, 5000]}
          min={0}
          max={5000}
          value={priceValues}
          onChange={setPriceValues}
          ariaLabel={['Lower thumb', 'Upper thumb']}
          pearling
          minDistance={10}
          // renderTrack gives us control over each segment (left, middle active, right)
          renderTrack={(props, state) => {
            // state.index: 0 = left track, 1 = active, 2 = right track
            const isActive = state.index === 1;
            const mergedClass = `${props.className ?? ''} ${
              isActive ? 'bg-indigo-600' : 'bg-gray-200'
            } rounded-full h-1`;
            // keep any props.style forwarded but we apply our own class for colors/height
            return <div {...props} className={mergedClass} style={{ ...props.style, top: '50%', transform: 'translateY(-50%)' }} />;
          }}
          // renderThumb to style the handle
          renderThumb={(props) => {
            const thumbClass = `${props.className ?? ''} inline-block h-5 w-5 rounded-full bg-indigo-600 border-2 border-white shadow-md focus:ring-2 focus:ring-indigo-300`;
            return <div {...props} className={thumbClass} />;
          }}
        />
      </div>

      {/* Input boxes for min and max */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full">
          <label htmlFor="min-price-input" className="block text-sm font-medium">Min</label>
          <input
            id="min-price-input"
            type="number"
            value={priceValues[0]}
            onChange={(e) => {
              const v = Number(e.target.value || 0);
              setPriceValues([v, Math.max(v, priceValues[1])]); // ensure min <= max
            }}
            className="w-full p-2 border rounded-md mt-1"
          />
        </div>
        <span className="mt-6 font-bold">-</span>
        <div className="w-full">
          <label htmlFor="max-price-input" className="block text-sm font-medium">Max</label>
          <input
            id="max-price-input"
            type="number"
            value={priceValues[1]}
            onChange={(e) => {
              const v = Number(e.target.value || 0);
              setPriceValues([Math.min(priceValues[0], v), v]); // ensure min <= max
            }}
            className="w-full p-2 border rounded-md mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApplyClick}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}
