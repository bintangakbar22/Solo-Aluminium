import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import { URLAPI } from '../../Utils/Url';
import { FETCH_LOGIN,CONNECTED,LOGOUT,NOT_CONNECTED,GET_USER_DATA, UPDATE_USER_DATA, GET_CATEGORY, GET_PRODUCT, GET_TRANSACTIONS, GET_ALL_USER, GET_ALL_OUT_PRODUCTS, GET_ALL_IN_PRODUCTS, GET_TOTAL_EXPENSE, GET_TOTAL_INCOME, FINANCE_SCREEN } from '../types';

export const connectionChecker = () => {
  return async dispatch => {
    try {
      NetInfo.addEventListener(state => {
        if (state.isConnected) {
          dispatch({
            type: CONNECTED,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Not Connected!',
          });
          dispatch({
            type: NOT_CONNECTED,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const FinanceScreen = data => ({
  type: FINANCE_SCREEN,
  payload: data,
});

export const fetchingLogin = data => {
  return async dispatch => {
    const {email, password} = data;
    await axios
      .post(URLAPI + 'login', {
        email: email,
        password: password,
      })
      .then(res => {
        console.log(res.data.data)
        Toast.show({
          type: 'success',
          text1: 'Login Successful!',
        });
        dispatch({
          type: FETCH_LOGIN,
          payload: res.data.data,
          userData : res.data.data.user,
          accessToken:res.data.data.access_token,
          idUser : res.data.data.user.id
        });
      })
      .catch(function (error) {
          Toast.show({
            type: 'error',
            text1: 'Email or Password wRong',
          });
      });
  };
};

export const getUserData = (AccessToken,id) => {
  return async dispatch => {
    await axios
      .get(URLAPI + 'show-profile/'+id, {
        headers: {
          "Authorization": `Bearer ${AccessToken}`
        }, 
      })
      .then(res => {
        dispatch({
          type: GET_USER_DATA,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
          // Toast.show({
          //   type: 'error',
          //   text1: 'error get user data, please login again',
          // });
          // dispatch(goLogout());
      });
  };
};

export const goLogout = (AccessToken) => {
  return async dispatch => {
    await axios
      .post(URLAPI + 'logout',{},{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        Toast.show({
          type: 'success',
          text1: 'Success Logout!',
        });
        dispatch({
            type: LOGOUT,
        });
      })
  }
};

export const updateUserData = (data, AccessToken,idUser) => {
  return async dispatch => {
    const {name, email, address} = data;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('address', address);
    await axios
      .post(URLAPI + 'user/'+idUser+'/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
          Toast.show({
            type: 'success',
            text1: 'Update Account Successful!',
          }); 
          dispatch({
            type: UPDATE_USER_DATA,
            payload: res.data.data,
          });
      
      })
      .catch(function (error) {
          Toast.show({
            type: 'error',
            text1: 'error update profile',
          });
      });
  };
};

export const updateAdminData = (data, AccessToken,idUser,imageTrue) => {
  return async dispatch => {
    const {image, name, email, address,password} = data;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('address', address);

    if (imageTrue==true) {
      formData.append('picture', {
        uri: image,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
    } 

    if (password!='') {
      formData.append('password', password);
    } 

    await axios
      .post(URLAPI + 'user/'+idUser+'/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        dispatch({
          type: UPDATE_USER_DATA,
          payload: res.data.data.data,
        });
        Toast.show({
          type: 'success',
          text1: 'Update Account Successful!',
        });
      })
      .catch(function (error) {
          Toast.show({
            type: 'error',
            text1: 'error update profile',
          });
      });
  };
};

export const updatePassword = (data, AccessToken,idUser) => {
  return async dispatch => {
    const {newPassword,confirmPassword} = data;
    if(newPassword==confirmPassword){
      await axios
        .post(URLAPI + 'user/'+idUser+'/update', {
          password: newPassword
        },{
          headers: {
            Accept: 'application/json',
            "Authorization": `Bearer ${AccessToken}`
          },
        })
        .then(res => {
          console.log(res.data)
          Toast.show({
            type: 'success',
            text1: 'Password Successfully Updated!',
          });
        })
    }else{
        Toast.show({
              type: 'error',
              text1: 'Password Not Same!',
        });
    }
  };
};

export const getCategory = (AccessToken) => {
  return async dispatch => {
    await axios
      .get(URLAPI + 'categories', {
        headers: {
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        dispatch({
          type: GET_CATEGORY,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
          // Toast.show({
          //   type: 'error',
          //   text1: 'error get category',
          // });
      });
  };
};

export const getProducts = (AccessToken) => {
  return async dispatch => {
    await axios
      .get(URLAPI + 'all-products', {
        headers: {
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        dispatch({
          type: GET_PRODUCT,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
          // Toast.show({
          //   type: 'error',
          //   text1: 'error get product',
          // });
      });
  };
};

export const getTransactions = (AccessToken) => {
  return async dispatch => {
    await axios
      .get(URLAPI + 'transactions', {
        headers: {
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        dispatch({
          type: GET_TRANSACTIONS,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
          // Toast.show({
          //   type: 'error',
          //   text1: 'error get transactions',
          // });
      });
  };
};

export const getAllUser = (AccessToken) => {
  return async dispatch => {
    await axios
      .get(URLAPI + 'admins', {
        headers: {
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        console.log(res.data.data)
        dispatch({
          type: GET_ALL_USER,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
        console.log(error)
          // Toast.show({
          //   type: 'error',
          //   text1: 'error get all user',
          // });
      });
  };
};


export const getAllOutProducts = (AccessToken) => {
  return async dispatch => {
    await axios
      .get(URLAPI + 'products-out', {
        headers: {
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        dispatch({
          type: GET_ALL_OUT_PRODUCTS,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
          // Toast.show({
          //   type: 'error',
          //   text1: 'error get all out products',
          // });
      });
  };
};

export const getAllInProducts = (AccessToken) => {
  return async dispatch => {
    await axios
      .get(URLAPI + 'products-in', {
        headers: {
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        dispatch({
          type: GET_ALL_IN_PRODUCTS,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
          // Toast.show({
          //   type: 'error',
          //   text1: 'error get all in products',
          // });
      });
  };
};

export const getTotalExpense = (AccessToken) => {
  return async dispatch => {
    await axios
      .get(URLAPI + 'total-expense', {
        headers: {
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        dispatch({
          type: GET_TOTAL_EXPENSE,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
          // Toast.show({
          //   type: 'error',
          //   text1: 'error get total expense',
          // });
      });
  };
};

export const getTotalIncome = (AccessToken) => {
  return async dispatch => {
    await axios
      .get(URLAPI + 'total-income', {
        headers: {
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        dispatch({
          type: GET_TOTAL_INCOME,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
          // Toast.show({
          //   type: 'error',
          //   text1: 'error get total income',
          // });
      });
  };
};


export const createCategory = (data,AccessToken) => {
  return async dispatch => {
    const {name} = data;
    await axios
      .post(URLAPI + 'category', {
        name: name
      },{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        Toast.show({
          type: 'success',
          text1: 'Category Successfully Added!',
        });
      })
  };
};

export const updateCategory = (data,AccessToken,id) => {
  return async dispatch => {
    const {name} = data;
    await axios
      .post(URLAPI + 'category/'+id+'/update', {
        name: name
      },{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        console.log(res.data)
        Toast.show({
          type: 'success',
          text1: 'Category Successfully Updated!',
        });
      })
  };
};

export const deleteCategory = (AccessToken,id) => {
  return async dispatch => {
    await axios
      .post(URLAPI + 'category/'+id+'/destroy',{},{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        Toast.show({
          type: 'success',
          text1: 'Category Successfully Deleted!',
        });
      })
  };
};

export const createTransaction = (data,AccessToken) => {
  return async dispatch => {
    const {type,quantity,product_id} = data;
    console.log("act ",data)
    await axios
      .post(URLAPI + 'transaction', {
        type:type,
        quantity:quantity,
        product_id:product_id
      },{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        Toast.show({
          type: 'success',
          text1: 'Transaction Successfully Added!',
        });
      }).catch(function (error) {
        console.log(error)
          Toast.show({
            type: 'error',
            text1: 'error create transaction',
          });
      });
  };
};

export const updateTransaction = (data,AccessToken) => {
  return async dispatch => {
    const {type,quantity,product_id,id} = data;
    await axios
      .post(URLAPI + 'transaction/'+id+'/update', {
        type:type,
        quantity:quantity,
        product_id:product_id,
      },{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        console.log(res.data)
        Toast.show({
          type: 'success',
          text1: 'Transaction Successfully Updated!',
        });
      })
  };
};

export const deleteTransaction = (AccessToken,id) => {
  return async dispatch => {
    await axios
      .post(URLAPI + 'transaction/'+id+'/destroy',{},{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        Toast.show({
          type: 'success',
          text1: 'Transaction Successfully Deleted!',
        });
      })
  };
};



export const createProduct = (data,AccessToken,imageTrue,imageName,category_id,userId) => {
  return async dispatch => {
    const {name,price,stock,code,length,width,image} = data;
    await axios
      .post(URLAPI + 'product', {
        name: name,
        price:price,
        stock:stock,
        category_id:category_id,
        code:code,
        length:length,
        width:width,
        admin_id:userId.toString()
      },{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        if(imageTrue==true){
          RNFetchBlob.fetch('POST', URLAPI+'product/'+res.data.data.id+'/update', {
            Authorization: `Bearer ${AccessToken}`,
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
          }, [
              { name: 'picture', filename: imageName, type: 'image/png', data: image },
            ]).then((resp) => {
              console.log("Upload Berhasil")
               Toast.show({
                type: 'success',
                text1: 'Product Successfully Added!',
              });
            }).catch((err) => {
              console.log("Upload gagal")
              Toast.show({
                type: 'error',
                text1: 'Failed Post Photo!',
              });
            })
        }else{
          Toast.show({
            type: 'success',
            text1: 'Product Successfully Added!',
          });
        }
       
      })
  };
};

export const updateProduct = (data,AccessToken,category_id,id) => {
  return async dispatch => {
    const {name,price,stock,code,length,width} = data;
    await axios
      .post(URLAPI + 'product/'+id+'/update', {
        name: name,
        price:price,
        stock:stock,
        category_id:category_id,
        code:code,
        length:length,
        width:width,
      },{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        console.log(res.data)
        Toast.show({
          type: 'success',
          text1: 'Product Successfully Updated!',
        });
      })
  };
};

export const deleteProduct = (AccessToken,id) => {
  return async dispatch => {
    await axios
      .post(URLAPI + 'product/'+id+'/destroy',{},{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        Toast.show({
          type: 'success',
          text1: 'Product Successfully Deleted!',
        });
      })
  };
};

export const createAdmin = (data,AccessToken,imageTrue,imageName,role_id) => {
  return async dispatch => {
    const {name,email,password,address,image} = data;
    await axios
      .post(URLAPI + 'create-admin', {
        name: name,
        email:email,
        password:password,
        address:address,
        role_id:role_id,
      },{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      }).then((res) => {
        if(imageTrue==true){
          RNFetchBlob.fetch('POST', URLAPI+'admin/'+res.data.data.id+'/update', {
            Authorization: `Bearer ${AccessToken}`,
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
          }, [
              { name: 'picture', filename: imageName, type: 'image/png', data: image },
            ]).then((resp) => {
              Toast.show({
                type: 'success',
                text1: 'Admin Successfully Added!',
              });
            }).catch((err) => {
              Toast.show({
                type: 'error',
                text1: 'Failed add admin!',
              });
            })
        }else{
          Toast.show({
            type: 'success',
            text1: 'Admin Successfully Added!',
          });
        }
      }).catch((err) => {
        console.log("Upload gagal")
        Toast.show({
          type: 'error',
          text1: 'Failed add admin!',
        });
      })
  };
};

export const updateAdmin = (data,AccessToken,role_id,id) => {
  return async dispatch => {
    const {name,email,address} = data;
    await axios
      .post(URLAPI + 'admin/'+id+'/update', {
        name: name,
        email:email,
        address:address,
        role_id:role_id,
      },{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      }).then((res) => {
          Toast.show({
            type: 'success',
            text1: 'Admin Successfully Updated!',
          });
      }).catch((err) => {
        console.log("Upload gagal")
        Toast.show({
          type: 'error',
          text1: 'Failed update admin!',
        });
      })
  };
};

export const deleteAdmin = (AccessToken,id) => {
  return async dispatch => {
    await axios
      .post(URLAPI + 'admin/'+id+'/destroy',{},{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        Toast.show({
          type: 'success',
          text1: 'Admin Successfully Deleted!',
        });
      })
  };
};

export const resetPassword = (AccessToken,id) => {
  return async dispatch => {
    await axios
      .post(URLAPI + 'admin/'+id+'/update', {
        password: 'password',
      },{
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer ${AccessToken}`
        },
      })
      .then(res => {
        console.log(res.data)
        Toast.show({
          type: 'success',
          text1: 'Reset Password Success!',
        });
      })
  };
};


export const rupiah = number => {
  let reverse,thousand ;
  if(typeof number =="number"){
    reverse =  number.toString().split('').reverse().join('')
     thousand = reverse.match(/\d{1,3}/g);
     thousand = thousand.join('.').split('').reverse().join('');
  }else {
    reverse =  number.split('').reverse().join('')
     thousand = reverse.match(/\d{1,3}/g);
     thousand = thousand.join('.').split('').reverse().join('');
  }
  
  return thousand;
};


