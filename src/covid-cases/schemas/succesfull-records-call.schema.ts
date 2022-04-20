export const successfulRecordsCallSchema = {
  type: 'object',
  title: 'location->variantsRecord',
  additionalProperties: {
    title: 'variant->num_sequences',
    type: 'object',
    additionalProperties: {
      type: 'number',
    },
  },
  example: {
    Brazil: { Delta: 100, Omicron: 50 },
    Italy: { Alpha: 12, Omicron: 100 },
    England: { Delta: 113, Alpha: 13 },
  },
};
