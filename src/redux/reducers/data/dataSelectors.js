import { createSelector } from '@reduxjs/toolkit';
import { searchStructure } from '../../common';

// Plain selectors
export const selectStatus = (state) => state.data.status;
export const selectData = (state) => state.data.data;
export const selectDataType = (state) => state.data.dataType;
export const selectRandomQuoteID = (state) => state.data.quoteID;
// First key, second value, use with shallowEqual
export const selectFilter = (state) => state.data.filter;

// Memoized selectors
// Select entities matching filters
export const selectFilteredData = createSelector(
   selectData,
   selectFilter,
   (data, filter) => {
      const [key, value] = filter;
      if (!data || !key || !value) return null;
      return data.filter((entity) => String(entity[key]) === value);
   }
);

// Select unique values for search fields
export const selectSearchValues = createSelector(
   selectData,
   selectDataType,
   (data, dataType) => {
      const searchValues = searchStructure[dataType].map((field) => {
         const uniqValues = [];
         data.forEach((entity) => {
            const fieldValue = entity[field.fieldName];
            if (!uniqValues.includes(fieldValue)) uniqValues.push(fieldValue);
         });
         return {
            ...field,
            uniqValues,
         };
      });
      return searchValues;
   }
);

// Select unique values of field
// export const selectUniqValues = createSelector(
//    selectData,
//    selectFilter,
//    (data, filter) => {
//       const key = filter[0];
//       if (!data || !key) return null;
//       return data.reduce((prev, entity) => {
//          const value = String(entity[key]);
//          if (!prev.includes(value)) prev.push(value);
//          return prev;
//       }, []);
//    }
// );
