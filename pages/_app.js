import App, { Container } from 'next/app'
import React from 'react'
import { Provider } from 'mobx-react';

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Provider store={null}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}