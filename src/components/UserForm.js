import React from "react";
import { Form, Field, withFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useState, useEffect } from "react";

const UserForm = ({ errors, touched, values, status }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);
  return (
    <div>
      <Form>
        {touched.name && errors.name && <p className="error">{errors.name}</p>}
        <Field type="text" name="name" placeholder="name" />
        {touched.email && errors.email && (
          <p className="error">{errors.email}</p>
        )}
        <Field type="email" name="email" placeholder="email" />
        {touched.password && errors.password && (
          <p className="error">{errors.password}</p>
        )}
        <Field type="password" name="password" placeholder="password" />
        <label>
          {touched.tos && errors.tos && <p className="error">{errors.tos}</p>}
          <Field type="checkbox" name="tos" />
          Agree to Terms of Service
        </label>
        <button type="submit">Submit</button>
      </Form>
      {users.map(users => (
        <ul key={users.id}>
          <li>Name: {users.data.name}</li>
          <li>Email: {users.data.email}</li>
          <li>Password: {users.data.password}</li>
          <li>TOS Accepted: {JSON.stringify(users.data.tos)}</li>
        </ul>
      ))}
    </div>
  );
};
const FormikUserForm = withFormik({
  mapPropsToValues: ({ name, email, password, tos }) => {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || false,
    };
  },
  validationSchema: yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    tos: yup
      .boolean()
      .oneOf([true], "You must accept TOS")
      .required("Please accept tos"),
  }),
  handleSubmit: (values, { resetForm, setStatus }) => {
    axios
      .post("https://reqres.in/api/users", values)
      .then(response => {
        console.log(response);
        setStatus(response);
        resetForm();
      })
      .catch(error => {
        console.log(error);
      });
  },
})(UserForm);

export default FormikUserForm;