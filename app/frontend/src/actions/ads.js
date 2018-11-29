export const UPDATE_CURRENT_AD = 'UPDATE_CURRENT_AD';

export const updateAd = (ad) => {
    return {
        type: UPDATE_CURRENT_AD,
        ad
    };
};