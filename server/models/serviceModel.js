import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema(
    {
        // Manual entry
        path: { type: String, trim: true },
        success: { type: mongoose.Schema.Types.Mixed },

        // SpeedQueen
        token: { type: String, trim: true },
        user_id: { type: String, trim: true },
        org_id: { type: String, trim: true },
    },
    { _id: false },
)

const serviceSchema = mongoose.Schema(
    {
        service: { type: String, required: true, unique: true, trim: true },
        url: { type: String, required: true, trim: true },
        type: { type: String, required: true },
        data: {
            type: dataSchema,
            required: true,
            validate: {
                validator: function (value) {
                    const hasPathSuccess = value?.data?.path && value?.data?.success !== undefined;
                    const hasTokenUserId = value?.data?.token && value?.data?.user_id && value?.data?.org_id;

                    return hasPathSuccess || hasTokenUserId;
                },
                message: 'Data must contain either { path, success } or { token, user_id, org_id }',
            },
        },
    },
    { timestamps: true },
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;