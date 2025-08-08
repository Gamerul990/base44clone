import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/code_repositories/code_repositoriesSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditCode_repositoriesPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'client_folder': '',

    'server_folder': '',

    project: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { code_repositories } = useAppSelector((state) => state.code_repositories)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof code_repositories === 'object') {
      setInitialValues(code_repositories)
    }
  }, [code_repositories])

  useEffect(() => {
      if (typeof code_repositories === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (code_repositories)[el])
          setInitialValues(newInitialVal);
      }
  }, [code_repositories])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/code_repositories/code_repositories-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit code_repositories')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit code_repositories'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="ClientFolder"
    >
        <Field
            name="client_folder"
            placeholder="ClientFolder"
        />
    </FormField>

    <FormField
        label="ServerFolder"
    >
        <Field
            name="server_folder"
            placeholder="ServerFolder"
        />
    </FormField>

  <FormField label='Project' labelFor='project'>
        <Field
            name='project'
            id='project'
            component={SelectField}
            options={initialValues.project}
            itemRef={'projects'}

            showField={'name'}

        ></Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/code_repositories/code_repositories-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditCode_repositoriesPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditCode_repositoriesPage
