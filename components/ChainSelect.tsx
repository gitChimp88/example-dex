import { Avatar, Select } from 'antd';
import React from 'react';
import { Chain, ChainKey, getChainByKey } from './types';

interface ChainSelectProps {
  availableChains: Array<Chain>;
  selectedChain?: ChainKey;
  onChangeSelectedChain: Function;
  disabled?: boolean;
}

const ChainSelect = ({
  availableChains,
  selectedChain,
  onChangeSelectedChain,
  disabled = false,
}: ChainSelectProps) => {
  const chain = selectedChain ? getChainByKey(selectedChain) : undefined;

  return (
    <div style={{ display: 'flex' }}>
      {chain ? (
        <Avatar size="small" src={chain.logoURI} alt={chain.name}>
          {chain.name[0]}
        </Avatar>
      ) : (
        ''
      )}

      <Select
        style={{ width: 200, position: 'relative', marginRight: '10px' }}
        disabled={disabled}
        placeholder="Select Chain"
        value={selectedChain}
        onChange={(v: ChainKey) => onChangeSelectedChain(v)}
        bordered={false}
        optionLabelProp="data-label"
      >
        <Select.OptGroup label="Supported Chains">
          {availableChains.map((chain) => (
            <Select.Option
              key={chain.key}
              value={chain.key}
              data-label={chain.name}
            >
              <div className="option-item">
                <span role="img" aria-label={chain.name}>
                  <Avatar
                    size="small"
                    src={chain.logoURI}
                    alt={chain.key}
                    style={{ marginRight: 10 }}
                  >
                    {chain.name[0]}
                  </Avatar>
                </span>
                <span className="option-name">{chain.name}</span>
              </div>
            </Select.Option>
          ))}
        </Select.OptGroup>
      </Select>
    </div>
  );
};

export default ChainSelect;
