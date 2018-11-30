import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Toast from './Toast';
import { removeToast } from 'actions/toasts';
import 'styles/Toasts.css';

const Toasts = ({ removeToastClicked, toasts }) => {
  return (
    <ul className='toasts'>
      {toasts.map(toast => {
        const { id } = toast;
        return (
            <Toast {...toast} key={id} onDismissClick={() => removeToastClicked(id)} />
        );
      })}
    </ul>
  );
};

Toasts.propTypes = {
    removeToastClicked: PropTypes.func.isRequired,
    toasts: PropTypes.array.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        removeToastClicked: (id) => {
            dispatch(removeToast(id));
        }
    };
};

const mapStateToProps = state => ({
    toasts: state.toasts
});

export default connect(mapStateToProps, mapDispatchToProps)(Toasts);