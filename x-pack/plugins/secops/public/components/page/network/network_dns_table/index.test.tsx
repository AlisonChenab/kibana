/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { getOr } from 'lodash/fp';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider as ReduxStoreProvider } from 'react-redux';

import { mockGlobalState, TestProviders } from '../../../../mock';
import { createStore, networkModel, State } from '../../../../store';

import { NetworkDnsTable } from '.';
import { mockData } from './mock';

describe('NetworkTopNFlow Table Component', () => {
  const startDate = new Date('2019-01-08T16:31:10.707Z').valueOf();
  const loadMore = jest.fn();
  const state: State = mockGlobalState;

  let store = createStore(state);

  beforeEach(() => {
    store = createStore(state);
  });

  describe('rendering', () => {
    test('it renders the default NetworkTopNFlow table', () => {
      const wrapper = shallow(
        <ReduxStoreProvider store={store}>
          <NetworkDnsTable
            loading={false}
            data={mockData.NetworkDns.edges}
            totalCount={mockData.NetworkDns.totalCount}
            hasNextPage={getOr(false, 'hasNextPage', mockData.NetworkDns.pageInfo)!}
            nextCursor={getOr(null, 'endCursor.value', mockData.NetworkDns.pageInfo)!}
            loadMore={loadMore}
            startDate={startDate}
            type={networkModel.NetworkType.page}
          />
        </ReduxStoreProvider>
      );

      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('Sorting', () => {
    test('when you click on the column header, you should show the sorting icon', () => {
      const wrapper = mount(
        <MockedProvider>
          <TestProviders>
            <NetworkDnsTable
              loading={false}
              data={mockData.NetworkDns.edges}
              totalCount={mockData.NetworkDns.totalCount}
              hasNextPage={getOr(false, 'hasNextPage', mockData.NetworkDns.pageInfo)!}
              nextCursor={getOr(null, 'endCursor.value', mockData.NetworkDns.pageInfo)!}
              loadMore={loadMore}
              startDate={startDate}
              type={networkModel.NetworkType.page}
            />
          </TestProviders>
        </MockedProvider>
      );

      wrapper
        .find('.euiTable thead tr th button')
        .first()
        .simulate('click');

      wrapper.update();

      expect(wrapper.find('.euiTable thead tr th button svg')).toBeTruthy();
    });
  });
});
